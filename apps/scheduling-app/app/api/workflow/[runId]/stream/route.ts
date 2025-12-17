import { getRun } from 'workflow/api';
import { NextRequest, NextResponse } from 'next/server';
import type { BookingProgress } from '@/lib/workflow';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * SSE endpoint to subscribe to booking workflow progress.
 * 
 * Usage:
 *   GET /api/workflow/:runId/stream
 *   GET /api/workflow/:runId/stream?startIndex=5  (for reconnection)
 *   
 * Returns a Server-Sent Events stream with BookingProgress updates.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;
  const { searchParams } = new URL(request.url);
  
  // Support reconnection from a specific index
  const startIndexParam = searchParams.get('startIndex');
  const startIndex = startIndexParam ? parseInt(startIndexParam, 10) : undefined;

  console.log('[workflow/stream] Request received for runId:', runId, 'startIndex:', startIndex);

  if (!runId) {
    console.error('[workflow/stream] Missing runId');
    return NextResponse.json({ error: 'Missing runId' }, { status: 400 });
  }

  try {
    console.log('[workflow/stream] Getting run for:', runId);
    const run = getRun<BookingProgress>(runId);
    
    console.log('[workflow/stream] Getting readable stream, startIndex:', startIndex);
    const readable = run.getReadable({ startIndex });
    console.log('[workflow/stream] Got readable stream for:', runId);

    // Transform the readable stream to SSE format
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        console.log('[workflow/stream] Starting stream reader for:', runId);
        const reader = readable.getReader();

        try {
          let eventCount = 0;
          while (true) {
            console.log('[workflow/stream] Waiting for next event...');
            const { done, value } = await reader.read();
            
            if (done) {
              console.log('[workflow/stream] Stream done, sent', eventCount, 'events for:', runId);
              controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
              controller.close();
              break;
            }

            eventCount++;
            console.log('[workflow/stream] Event', eventCount, 'for', runId, ':', value);
            const data = JSON.stringify(value);
            controller.enqueue(encoder.encode(`event: progress\ndata: ${data}\n\n`));
          }
        } catch (error) {
          console.error('[workflow/stream] Stream read error for', runId, ':', error);
          const errorData = JSON.stringify({ 
            type: 'error', 
            message: error instanceof Error ? error.message : 'Stream error' 
          });
          controller.enqueue(encoder.encode(`event: error\ndata: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    console.log('[workflow/stream] Returning SSE response for:', runId);
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[workflow/stream] Failed to get readable stream for', runId, ':', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to workflow', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

