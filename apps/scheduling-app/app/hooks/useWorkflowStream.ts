import { useState, useCallback, useRef, useEffect } from 'react';
import type { BookingProgress } from '../../lib/workflow';

type StreamStatus = 'idle' | 'connecting' | 'connected' | 'done' | 'error';

interface UseWorkflowStreamResult {
  /** Current status of the SSE connection */
  status: StreamStatus;
  /** All progress updates received so far */
  updates: BookingProgress[];
  /** The latest progress update */
  latestUpdate: BookingProgress | null;
  /** Error message if status is 'error' */
  error: string | null;
  /** Subscribe to a workflow run's stream */
  subscribe: (runId: string) => void;
  /** Close the current connection */
  close: () => void;
  /** Reset state */
  reset: () => void;
}

/**
 * Hook to subscribe to a booking workflow's SSE progress stream.
 */
export function useWorkflowStream(): UseWorkflowStreamResult {
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [updates, setUpdates] = useState<BookingProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const statusRef = useRef<StreamStatus>('idle');
  const subscribedRunIdRef = useRef<string | null>(null);

  // Keep statusRef in sync
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const close = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('[useWorkflowStream] Closing EventSource');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    close();
    subscribedRunIdRef.current = null;
    setStatus('idle');
    setUpdates([]);
    setError(null);
  }, [close]);

  const subscribe = useCallback((runId: string) => {
    // Prevent duplicate subscriptions to the same run
    if (subscribedRunIdRef.current === runId) {
      console.log('[useWorkflowStream] Already subscribed to:', runId);
      return;
    }

    console.log('[useWorkflowStream] subscribe() called with runId:', runId);
    
    // Close any existing connection
    close();
    subscribedRunIdRef.current = runId;

    setStatus('connecting');
    setError(null);
    setUpdates([]);

    const url = `/api/workflow/${runId}/stream`;
    console.log('[useWorkflowStream] Creating EventSource for:', url);
    
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('[useWorkflowStream] onopen - Connected');
      setStatus('connected');
    };

    eventSource.addEventListener('progress', (event) => {
      try {
        const data = JSON.parse(event.data) as BookingProgress;
        console.log('[useWorkflowStream] Progress:', data.type);
        setUpdates((prev) => [...prev, data]);
      } catch (e) {
        console.error('[useWorkflowStream] Failed to parse progress:', e);
      }
    });

    eventSource.addEventListener('done', () => {
      console.log('[useWorkflowStream] Stream completed normally');
      setStatus('done');
      close();
    });

    eventSource.addEventListener('error', (event) => {
      // This is a server-sent error event (different from onerror)
      try {
        const data = JSON.parse((event as MessageEvent).data);
        console.error('[useWorkflowStream] Server error:', data);
        setError(data.message || 'Stream error');
        setStatus('error');
        close();
      } catch {
        // Not a parseable error event, ignore
      }
    });

    eventSource.onerror = () => {
      // This fires when connection closes or errors
      // Only treat as error if we didn't complete successfully
      if (statusRef.current === 'done') {
        console.log('[useWorkflowStream] onerror after done - ignoring');
        return;
      }
      
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('[useWorkflowStream] Connection closed unexpectedly');
        setError('Connection closed unexpectedly');
        setStatus('error');
      }
      // If CONNECTING, let it retry
    };
  }, [close]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      close();
    };
  }, [close]);

  const latestUpdate = updates.length > 0 ? updates[updates.length - 1] : null;

  return {
    status,
    updates,
    latestUpdate,
    error,
    subscribe,
    close,
    reset,
  };
}
