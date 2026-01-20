import { getRun } from 'workflow/api';
import { NextRequest, NextResponse } from 'next/server';
import type { BookingProgress, BookingWorkflowResult } from '@/lib/workflow';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/workflow/:runId/status
 * 
 * Returns the current status of a workflow run and any progress updates since a given index.
 * Used for polling when the SSE stream may have timed out.
 * 
 * Query params:
 *   - startIndex: (optional) Only return progress updates after this index
 * 
 * Returns:
 *   {
 *     status: 'running' | 'completed' | 'failed' | 'cancelled',
 *     latestProgress: BookingProgress | null,
 *     progressUpdates: BookingProgress[],
 *     hasMore: boolean
 *   }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;
  const { searchParams } = new URL(request.url);
  
  const startIndexParam = searchParams.get('startIndex');
  const startIndex = startIndexParam ? parseInt(startIndexParam, 10) : undefined;

  console.log('[workflow/status] Request received for runId:', runId, 'startIndex:', startIndex);

  if (!runId) {
    console.error('[workflow/status] Missing runId');
    return NextResponse.json({ error: 'Missing runId' }, { status: 400 });
  }

  try {
    // Get workflow run status
    const run = getRun<BookingWorkflowResult>(runId);
    const status = await run.status;
    
    console.log('[workflow/status] Workflow status:', status, 'for runId:', runId);

    // Get progress updates if available
    let latestProgress: BookingProgress | null = null;
    let progressUpdates: BookingProgress[] = [];
    let hasMore = false;

    try {
      const readable = run.getReadable({ startIndex });
      const reader = readable.getReader();
      
      // Read available progress updates (non-blocking with timeout)
      const updates: BookingProgress[] = [];
      let lastUpdate: BookingProgress | null = null;
      
      try {
        // Try to read updates with a short timeout to avoid blocking
        const readWithTimeout = async (): Promise<void> => {
          const startTime = Date.now();
          const MAX_READ_TIME = 200; // Max 200ms to read updates
          
          while (Date.now() - startTime < MAX_READ_TIME) {
            const readPromise = reader.read();
            const timeoutPromise = new Promise<{ done: true; value: undefined }>((resolve) => 
              setTimeout(() => resolve({ done: true, value: undefined }), 50)
            );
            
            const { done, value } = await Promise.race([readPromise, timeoutPromise]);
            
            if (done) {
              break;
            }
            
            if (value) {
              updates.push(value as BookingProgress);
              lastUpdate = value as BookingProgress;
            }
          }
        };
        
        await readWithTimeout();
      } catch (readError) {
        // Reader may be closed, in use, or timed out - that's okay
        console.log('[workflow/status] Finished reading updates:', readError instanceof Error ? readError.message : 'unknown');
      } finally {
        try {
          reader.releaseLock();
        } catch (releaseError) {
          // Lock may already be released, that's fine
          console.log('[workflow/status] Could not release lock (may already be released)', releaseError instanceof Error ? releaseError.message : 'unknown');
        }
      }
      
      progressUpdates = updates;
      latestProgress = lastUpdate;
      hasMore = updates.length > 0;
      
      console.log('[workflow/status] Found', updates.length, 'progress updates for runId:', runId);
    } catch (readableError) {
      // If we can't read progress (e.g., stream is in use by another connection), that's okay
      console.log('[workflow/status] Could not read progress stream:', readableError instanceof Error ? readableError.message : 'unknown');
    }

    // If workflow is completed, try to get the final result
    if (status === 'completed') {
      try {
        const result = await run.returnValue;
        // If we have a result with session_ready, ensure we have that progress
        if (result && 'sessionUrl' in result && !latestProgress) {
          latestProgress = {
            type: 'session_ready',
            message: 'Done! Redirecting...',
            data: {
              sessionUrl: result.sessionUrl,
              confirmationId: runId,
            },
            timestamp: new Date().toISOString(),
          };
        }
      } catch (resultError) {
        console.log('[workflow/status] Could not get return value:', resultError instanceof Error ? resultError.message : 'unknown');
      }
    }

    return NextResponse.json({
      status,
      latestProgress,
      progressUpdates,
      hasMore,
    });
  } catch (error) {
    console.error('[workflow/status] Failed to get workflow status for', runId, ':', error);
    return NextResponse.json(
      { 
        error: 'Failed to get workflow status', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
