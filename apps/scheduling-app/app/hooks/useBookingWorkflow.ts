import { useState, useCallback, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { getAnyStoredLeadId, clearStoredLeadId } from '../providers/_lib/salesforce';
import { useBuildUrlWithUtm } from '../providers/_lib/utm';
import type { PostHog } from 'posthog-js';
import type { BookingProgress, BookingProgressType } from '../../lib/workflow';

export type BookingWorkflowState =
  | { status: 'idle' }
  | { status: 'starting'; eventId: string }
  | { 
      status: 'booking'; 
      eventId: string; 
      providerId: string; 
      confirmationId: string; 
      currentStep: BookingProgressType;
    }
  | { status: 'redirecting'; confirmationId: string }
  | { status: 'error'; message: string };

export interface StartBookingParams {
  eventId: string;
  providerId: string;
  userName: string;
  locationType: string;
  slotStartTime: string;
  /** Patient's first name (required) */
  firstName: string;
  /** Patient's last name (required) */
  lastName: string;
  /** Patient's phone number */
  phone?: string;
  /** Patient's state code (e.g., "CA", "NY") */
  state?: string;
  patientTimezone?: string;
  clinicalFocus?: string;
}

interface UseBookingWorkflowOptions {
  posthog?: PostHog | null;
}

interface UseBookingWorkflowResult {
  /** Current booking state */
  state: BookingWorkflowState;
  /** Start the booking workflow */
  startBooking: (params: StartBookingParams) => Promise<void>;
  /** Reset to idle state */
  reset: () => void;
  /** Retry the last booking attempt */
  retry: () => Promise<void>;
  /** Whether the modal should be shown */
  isModalOpen: boolean;
  /** Current step for the modal */
  currentStep: BookingProgressType | 'done' | null;
  /** Error message if any */
  error: string | null;
}

/**
 * Parse SSE events from a text chunk.
 * SSE format: "event: eventName\ndata: jsonData\n\n"
 */
function parseSSEEvents(text: string): Array<{ event: string; data: string }> {
  const events: Array<{ event: string; data: string }> = [];
  const lines = text.split('\n');
  
  let currentEvent = '';
  let currentData = '';
  
  for (const line of lines) {
    if (line.startsWith('event: ')) {
      currentEvent = line.slice(7);
    } else if (line.startsWith('data: ')) {
      currentData = line.slice(6);
    } else if (line === '' && currentEvent && currentData) {
      events.push({ event: currentEvent, data: currentData });
      currentEvent = '';
      currentData = '';
    }
  }
  
  return events;
}

/**
 * Hook to manage the booking workflow with streaming progress.
 * 
 * Handles:
 * - Starting the booking workflow via API route
 * - Reading progress from the streaming response
 * - Updating state based on stream updates
 * - Showing modal with step-by-step progress
 * - Redirecting to confirmation page when session is ready
 */
export function useBookingWorkflow(
  options: UseBookingWorkflowOptions = {}
): UseBookingWorkflowResult {
  const { posthog } = options;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const buildUrlWithUtm = useBuildUrlWithUtm();
  const [state, setState] = useState<BookingWorkflowState>({ status: 'idle' });
  const [currentStep, setCurrentStep] = useState<BookingProgressType | 'done' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastParamsRef = useRef<StartBookingParams | null>(null);

  const startBooking = useCallback(async (params: StartBookingParams) => {
    // Store params for retry
    lastParamsRef.current = params;
    let leadResult = getAnyStoredLeadId();

    // Fallback: Check for slc URL parameter if localStorage is unavailable
    if (!leadResult) {
      const slcParam = searchParams.get('slc');
      if (slcParam) {
        console.log('[useBookingWorkflow] Using slc param from URL as fallback (localStorage unavailable?)');
        leadResult = { leadId: slcParam, wasExpired: false };
        
        posthog?.capture('booking_used_slc_param_fallback', {
          provider_id: params.providerId,
          reason: 'localStorage_unavailable_or_missing',
        });
      }
    }

    // If still no lead exists, redirect to onboarding to ensure lead is created
    if (!leadResult) {
      console.log('[useBookingWorkflow] No lead found, redirecting to onboarding...');
      
      // Build onboarding URL with current page as target (preserving UTM params)
      const currentUrl = pathname || `/providers/${params.providerId}`;
      const onboardingUrl = buildUrlWithUtm('/onboarding', { target: currentUrl });
      
      // Capture analytics
      posthog?.capture('booking_redirected_to_onboarding', {
        provider_id: params.providerId,
        reason: 'missing_lead_id',
      });
      
      // Redirect to onboarding
      router.push(onboardingUrl);
      return;
    }

    // Track if lead was expired
    if (leadResult.wasExpired) {
      posthog?.capture('slc_expired', {
        previous_lead_id: leadResult.leadId,
      });
    }

    const leadId = leadResult.leadId;

    setState({ status: 'starting', eventId: params.eventId });
    setCurrentStep(null);
    setError(null);

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      console.log('[useBookingWorkflow] Starting workflow via API...');

      const response = await fetch('/api/booking/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: params.eventId,
          providerId: params.providerId,
          userName: params.userName,
          salesforceLeadId: leadId,
          locationType: params.locationType,
          firstName: params.firstName,
          lastName: params.lastName,
          phone: params.phone,
          state: params.state,
          patientTimezone: params.patientTimezone,
          clinicalFocus: params.clinicalFocus,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Get confirmationId (runId) from header
      const confirmationId = response.headers.get('X-Workflow-Run-Id');
      console.log('[useBookingWorkflow] Got confirmationId:', confirmationId);

      if (!confirmationId) {
        throw new Error('No workflow run ID returned');
      }

      setState({
        status: 'booking',
        eventId: params.eventId,
        providerId: params.providerId,
        confirmationId,
        currentStep: 'booking_started',
      });
      setCurrentStep('booking_started');

      // Capture analytics
      posthog?.capture('booking_workflow_started', {
        provider_id: params.providerId,
        confirmation_id: confirmationId,
        location_type: params.locationType,
      });

      // Read the streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('[useBookingWorkflow] Stream ended');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // Parse any complete SSE events from the buffer
        const events = parseSSEEvents(buffer);
        
        for (const sseEvent of events) {
          console.log('[useBookingWorkflow] SSE event:', sseEvent.event);

          if (sseEvent.event === 'progress') {
            try {
              const progress = JSON.parse(sseEvent.data) as BookingProgress;
              console.log('[useBookingWorkflow] Progress:', progress.type, progress.message);

              // Update current step
              setCurrentStep(progress.type);
              
              if (state.status === 'booking') {
                setState((prev) => {
                  if (prev.status !== 'booking') return prev;
                  return { ...prev, currentStep: progress.type };
                });
              }

              // When session is ready, redirect to confirmation page
              if (progress.type === 'session_ready') {
                const redirectConfirmationId = progress.data?.confirmationId || confirmationId;
                
                console.log('[useBookingWorkflow] Session ready, redirecting in 1s...');
                setCurrentStep('done');
                
                // Clear stored lead ID on successful booking
                const clearedLeadId = clearStoredLeadId();
                if (clearedLeadId) {
                  posthog?.capture('slc_cleared_on_booking', {
                    lead_id: clearedLeadId,
                    confirmation_id: redirectConfirmationId,
                  });
                }
                
                // Wait 1 second to show "Done! Redirecting..." state
                await new Promise((resolve) => setTimeout(resolve, 1000));
                
                setState({ status: 'redirecting', confirmationId: redirectConfirmationId });
                router.push(`/confirmation/${redirectConfirmationId}`);
                return;
              }

              // Handle errors
              if (progress.type === 'error') {
                setError(progress.data?.error || 'Booking failed');
                setState({ status: 'error', message: progress.data?.error || 'Booking failed' });
                return;
              }
            } catch (e) {
              console.error('[useBookingWorkflow] Failed to parse progress:', e);
            }
          } else if (sseEvent.event === 'error') {
            try {
              const errorData = JSON.parse(sseEvent.data);
              setError(errorData.message || 'Stream error');
              setState({ status: 'error', message: errorData.message || 'Stream error' });
              return;
            } catch (e) {
              console.error('[useBookingWorkflow] Failed to parse error:', e);
            }
          } else if (sseEvent.event === 'done') {
            console.log('[useBookingWorkflow] Received done event');
          }
        }

        // Clear the buffer of processed events
        const lastEventEnd = buffer.lastIndexOf('\n\n');
        if (lastEventEnd !== -1) {
          buffer = buffer.slice(lastEventEnd + 2);
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('[useBookingWorkflow] Request aborted');
        return;
      }
      console.error('[useBookingWorkflow] Failed:', err);
      const message = err instanceof Error ? err.message : 'Unable to start booking';
      setError(message);
      setState({ status: 'error', message });
    }
  }, [posthog, router, state.status, pathname, searchParams, buildUrlWithUtm]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState({ status: 'idle' });
    setCurrentStep(null);
    setError(null);
  }, []);

  const retry = useCallback(async () => {
    if (!lastParamsRef.current) {
      console.warn('[useBookingWorkflow] No previous params to retry');
      return;
    }
    // Reset state first
    setError(null);
    setCurrentStep(null);
    // Retry with same params
    await startBooking(lastParamsRef.current);
  }, [startBooking]);

  const isModalOpen = state.status === 'starting' || 
                      state.status === 'booking' || 
                      state.status === 'redirecting' ||
                      (state.status === 'error' && currentStep !== null);

  return {
    state,
    startBooking,
    reset,
    retry,
    isModalOpen,
    currentStep,
    error,
  };
}
