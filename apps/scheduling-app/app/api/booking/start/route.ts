import { NextRequest, NextResponse } from 'next/server';
import { start, getRun } from 'workflow/api';
import { bookingWorkflow, type BookingWorkflowInput, type BookingWorkflowResult } from '../../../../lib/workflow/bookingWorkflow';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/booking/start
 * 
 * Starts the booking workflow and returns an SSE stream with progress updates.
 * The runId is returned in a header for reconnection support.
 * 
 * If the workflow fails, an error event is sent before closing the stream.
 */
export async function POST(request: NextRequest) {
  try {
    const input: BookingWorkflowInput = await request.json();

    console.log('[booking/start] Starting booking workflow:', {
      eventId: input.eventId,
      providerId: input.providerId,
      salesforceLeadId: input.salesforceLeadId,
    });

    // Start the workflow and get both runId and readable stream
    const run = await start(bookingWorkflow, [input]);

    console.log('[booking/start] Workflow started, runId:', run.runId);

    // Transform the readable stream to SSE format
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        console.log('[booking/start] Starting stream reader');
        const reader = run.readable.getReader();
        let receivedSessionReady = false;

        try {
          let eventCount = 0;
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log('[booking/start] Stream done, sent', eventCount, 'events');
              
              // Check if we received the session_ready event
              // If not, the workflow may have failed - check its status
              if (!receivedSessionReady) {
                console.log('[booking/start] Did not receive session_ready, checking workflow status...');
                try {
                  const runStatus = getRun<BookingWorkflowResult>(run.runId);
                  const status = await runStatus.status;
                  console.log('[booking/start] Workflow status:', status);
                  
                  if (status === 'failed' || status === 'cancelled') {
                    const errorData = JSON.stringify({
                      type: 'error',
                      message: 'We were unable to complete your booking. Please try again.',
                      data: { error: `Workflow ${status}` },
                      timestamp: new Date().toISOString(),
                    });
                    controller.enqueue(encoder.encode(`event: progress\ndata: ${errorData}\n\n`));
                  }
                } catch (statusErr) {
                  console.error('[booking/start] Failed to check workflow status:', statusErr);
                }
              }
              
              controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
              controller.close();
              break;
            }

            eventCount++;
            console.log('[booking/start] Event', eventCount, ':', value);
            
            // Track if we received session_ready
            if (value && typeof value === 'object' && 'type' in value) {
              if (value.type === 'session_ready') {
                receivedSessionReady = true;
              }
            }
            
            const data = JSON.stringify(value);
            controller.enqueue(encoder.encode(`event: progress\ndata: ${data}\n\n`));
          }
        } catch (error) {
          console.error('[booking/start] Stream read error:', error);
          const errorData = JSON.stringify({
            type: 'error',
            message: 'Booking failed. Please try again.',
            data: { error: error instanceof Error ? error.message : 'Stream error' },
            timestamp: new Date().toISOString(),
          });
          controller.enqueue(encoder.encode(`event: progress\ndata: ${errorData}\n\n`));
          controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Workflow-Run-Id': run.runId,
      },
    });
  } catch (error) {
    console.error('[booking/start] Failed to start workflow:', error);
    return NextResponse.json(
      { error: 'Failed to start booking workflow', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
