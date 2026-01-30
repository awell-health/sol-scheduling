import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { getAnyStoredLeadId, clearAllBookingStorage, ensureLeadExistsAction, storeLeadId } from '../providers/_lib/salesforce';
import { readPreferencesFromStorage } from '../providers/_lib/onboarding/storage';
import { useBuildUrlWithUtm } from '../providers/_lib/utm';
import type { PostHog } from 'posthog-js';
import type { BookingProgress, BookingProgressType } from '../../lib/workflow';
import type { BookingFormStatus } from '../providers/[providerId]/components';

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
  | { status: 'waiting'; confirmationId: string; providerId: string }
  | { status: 'redirecting'; confirmationId: string }
  | { status: 'error'; message: string; showProviderAvailability?: boolean };

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
  /** Clinical focus / visit reason (e.g., 'ADHD', 'Anxiety') */
  clinicalFocus?: string;
  /** Service type / therapeutic modality (e.g., 'Psychiatric', 'Therapy', 'Both', 'Not Sure') */
  service?: string;
}

interface UseBookingWorkflowOptions {
  posthog?: PostHog | null;
}

export type ConnectionMode = 'sse' | 'polling' | 'idle';

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
  /** Whether to show waiting message */
  isWaiting: boolean;
  /** Whether to show provider availability button */
  showProviderAvailability: boolean;
  /** Current connection mode: 'sse' (receiving stream), 'polling' (fallback), or 'idle' */
  connectionMode: ConnectionMode;
  /** Timestamp of last message received (for debugging/health checks) */
  lastMessageTime: number | null;
  /** Status mapped for BookingForm compatibility (waiting → booking) */
  bookingFormStatus: BookingFormStatus;
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
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('idle');
  const [lastMessageTime, setLastMessageTime] = useState<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastParamsRef = useRef<StartBookingParams | null>(null);
  
  // Polling fallback state
  const lastMessageTimeRef = useRef<number | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastProgressIndexRef = useRef<number>(0);
  const isPollingRef = useRef<boolean>(false);
  const currentRunIdRef = useRef<string | null>(null);
  const pollingStartTimeRef = useRef<number | null>(null);
  const waitingMessageShownRef = useRef<boolean>(false);
  const currentEventIdRef = useRef<string | null>(null);

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

    // Get stored preferences for lead recreation if needed
    const storedPreferences = readPreferencesFromStorage();
    const phone = params.phone || storedPreferences.phone;

    // If no lead ID and no phone, redirect to onboarding
    if (!leadResult && !phone) {
      console.log('[useBookingWorkflow] No lead found and no phone, redirecting to onboarding...');
      
      // Build onboarding URL with current page as target (preserving UTM params)
      const currentUrl = pathname || `/providers/${params.providerId}`;
      const onboardingUrl = buildUrlWithUtm('/onboarding', { target: currentUrl });
      
      // Capture analytics
      posthog?.capture('booking_redirected_to_onboarding', {
        provider_id: params.providerId,
        reason: 'missing_lead_id_and_phone',
      });
      
      // Redirect to onboarding
      router.push(onboardingUrl);
      return;
    }

    // Track if lead was expired
    if (leadResult?.wasExpired) {
      posthog?.capture('slc_expired', {
        previous_lead_id: leadResult.leadId,
      });
    }

    // Show starting state while we validate/recreate the lead
    setState({ status: 'starting', eventId: params.eventId });

    // Ensure the lead exists in Salesforce (validates existing or creates new if deleted/converted)
    let leadId: string;
    
    if (phone) {
      try {
        console.log('[useBookingWorkflow] Ensuring lead exists...');
        const ensureResult = await ensureLeadExistsAction({
          currentLeadId: leadResult?.leadId,
          phone,
          state: params.state || storedPreferences.state,
          service: params.service || storedPreferences.service,
          insurance: storedPreferences.insurance,
          consent: storedPreferences.consent,
          posthogDistinctId: posthog?.get_distinct_id(),
        });

        if (!ensureResult.success || !ensureResult.leadId) {
          console.error('[useBookingWorkflow] Failed to ensure lead exists:', ensureResult.error);
          setError('Unable to verify your information. Please try again.');
          setState({ status: 'error', message: 'Unable to verify your information. Please try again.' });
          return;
        }

        leadId = ensureResult.leadId;

        // If lead was recreated, update localStorage
        if (ensureResult.wasRecreated) {
          storeLeadId(leadId, phone);
          posthog?.capture('lead_recreated_at_booking', {
            previous_lead_id: leadResult?.leadId,
            new_lead_id: leadId,
            reason: 'lead_deleted_or_converted',
          });
          console.log('[useBookingWorkflow] Lead was recreated:', {
            previousLeadId: leadResult?.leadId,
            newLeadId: leadId,
          });
        }
      } catch (err) {
        console.error('[useBookingWorkflow] Error ensuring lead exists:', err);
        // If we have an existing lead ID, try to proceed with it
        if (leadResult?.leadId) {
          console.log('[useBookingWorkflow] Falling back to existing lead ID');
          leadId = leadResult.leadId;
        } else {
          setError('Unable to verify your information. Please try again.');
          setState({ status: 'error', message: 'Unable to verify your information. Please try again.' });
          return;
        }
      }
    } else if (leadResult?.leadId) {
      // No phone but have lead ID - use existing (can't recreate without phone)
      leadId = leadResult.leadId;
    } else {
      // Should not reach here due to earlier check, but just in case
      console.log('[useBookingWorkflow] No lead found, redirecting to onboarding...');
      const currentUrl = pathname || `/providers/${params.providerId}`;
      const onboardingUrl = buildUrlWithUtm('/onboarding', { target: currentUrl });
      posthog?.capture('booking_redirected_to_onboarding', {
        provider_id: params.providerId,
        reason: 'missing_lead_id',
      });
      router.push(onboardingUrl);
      return;
    }

    // Now we have a valid leadId, proceed with booking
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
          service: params.service,
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
      
      // Initialize polling state
      currentRunIdRef.current = confirmationId;
      currentEventIdRef.current = params.eventId;
      const now = Date.now();
      lastMessageTimeRef.current = now;
      setLastMessageTime(now);
      lastProgressIndexRef.current = 0;
      isPollingRef.current = false;
      pollingStartTimeRef.current = null;
      waitingMessageShownRef.current = false;
      setConnectionMode('sse'); // Start with SSE connection

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
          
          // If stream ended but we haven't received session_ready, mark last message time
          // The useEffect will detect no new messages and start polling after 10 seconds
          // This handles the case where the Vercel function times out but workflow continues
          if (currentStep !== 'session_ready' && currentStep !== 'done' && confirmationId) {
            console.log('[useBookingWorkflow] Stream ended without completion, polling fallback will activate if no progress');
            // Don't update lastMessageTimeRef - let the useEffect detect stale connection
          }
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

              // Update last message time for polling fallback
              const now = Date.now();
              lastMessageTimeRef.current = now;
              setLastMessageTime(now);
              lastProgressIndexRef.current += 1;
              
              // If we were polling, switch back to SSE mode
              if (isPollingRef.current) {
                console.log('[useBookingWorkflow] Received SSE message, switching back from polling to SSE');
                isPollingRef.current = false;
                if (pollingIntervalRef.current) {
                  clearInterval(pollingIntervalRef.current);
                  pollingIntervalRef.current = null;
                }
                setConnectionMode('sse');
              }

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
                
                // Stop polling if active
                if (pollingIntervalRef.current) {
                  clearInterval(pollingIntervalRef.current);
                  pollingIntervalRef.current = null;
                  isPollingRef.current = false;
                }
                
                // Clear all booking storage on successful booking
                const clearedLeadId = clearAllBookingStorage();
                if (clearedLeadId) {
                  posthog?.capture('booking_storage_cleared', {
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
                // Stop polling if active
                if (pollingIntervalRef.current) {
                  clearInterval(pollingIntervalRef.current);
                  pollingIntervalRef.current = null;
                  isPollingRef.current = false;
                }
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

  // Polling function to check workflow status
  const pollWorkflowStatus = useCallback(async (runId: string, providerId: string) => {
    if (isPollingRef.current === false) {
      console.log('[useBookingWorkflow] Starting polling fallback for runId:', runId);
      isPollingRef.current = true;
      pollingStartTimeRef.current = Date.now();
      posthog?.capture('booking_polling_started', { confirmation_id: runId });
    }

    try {
      const response = await fetch(`/api/workflow/${runId}/status?startIndex=${lastProgressIndexRef.current}`);
      
      if (!response.ok) {
        console.error('[useBookingWorkflow] Polling failed:', response.status);
        return;
      }

      const data = await response.json();
      console.log('[useBookingWorkflow] Polling response:', data);

      // Check if we've been polling for more than 1 minute
      const pollingDuration = pollingStartTimeRef.current 
        ? Date.now() - pollingStartTimeRef.current 
        : 0;
      const ONE_MINUTE = 60000;

      // Process any new progress updates
      if (data.progressUpdates && data.progressUpdates.length > 0) {
        console.log('[useBookingWorkflow] Found', data.progressUpdates.length, 'new progress updates via polling');
        
        // Reset waiting message flag since we got progress
        waitingMessageShownRef.current = false;
        
        for (const progress of data.progressUpdates) {
          lastProgressIndexRef.current += 1;
          const now = Date.now();
          lastMessageTimeRef.current = now;
          setLastMessageTime(now);
          
          setCurrentStep(progress.type);
          
          setState((prev) => {
            if (prev.status === 'waiting') {
              return {
                status: 'booking',
                eventId: currentEventIdRef.current || '',
                providerId: prev.providerId,
                confirmationId: prev.confirmationId,
                currentStep: progress.type,
              };
            }
            if (prev.status !== 'booking') return prev;
            return { ...prev, currentStep: progress.type };
          });

          // Handle session_ready
          if (progress.type === 'session_ready') {
            const redirectConfirmationId = progress.data?.confirmationId || runId;
            
            console.log('[useBookingWorkflow] Session ready via polling, redirecting in 1s...');
            setCurrentStep('done');
            
            // Stop polling
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
              isPollingRef.current = false;
            }
            pollingStartTimeRef.current = null;
            setConnectionMode('idle'); // Will be set to 'redirecting' by state change
            
            // Clear all booking storage on successful booking
            const clearedLeadId = clearAllBookingStorage();
            if (clearedLeadId) {
              posthog?.capture('booking_storage_cleared', {
                lead_id: clearedLeadId,
                confirmation_id: redirectConfirmationId,
              });
            }

            // Wait 1 second to show "Done! Redirecting..." state
            setTimeout(() => {
              setState({ status: 'redirecting', confirmationId: redirectConfirmationId });
              router.push(`/confirmation/${redirectConfirmationId}`);
            }, 1000);
            return;
          }

          // Handle errors
          if (progress.type === 'error') {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
              isPollingRef.current = false;
            }
            pollingStartTimeRef.current = null;
            setError(progress.data?.error || 'Booking failed');
            setState({ status: 'error', message: progress.data?.error || 'Booking failed' });
            return;
          }
        }
      }

      // Check workflow status
      if (data.status === 'completed') {
        console.log('[useBookingWorkflow] Workflow completed via polling');
        
        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          isPollingRef.current = false;
        }
        pollingStartTimeRef.current = null;
        setConnectionMode('idle'); // Will be set appropriately by state change

        // If we have latest progress, use it
        if (data.latestProgress) {
          const progress = data.latestProgress as BookingProgress;
          if (progress.type === 'session_ready') {
            const redirectConfirmationId = progress.data?.confirmationId || runId;
            setCurrentStep('done');
            
            const clearedLeadId = clearAllBookingStorage();
            if (clearedLeadId) {
              posthog?.capture('booking_storage_cleared', {
                lead_id: clearedLeadId,
                confirmation_id: redirectConfirmationId,
              });
            }

            setTimeout(() => {
              setState({ status: 'redirecting', confirmationId: redirectConfirmationId });
              router.push(`/confirmation/${redirectConfirmationId}`);
            }, 1000);
            return;
          }
        }
        
        // If completed but no session_ready, redirect to confirmation anyway
        // (workflow completed successfully but stream timed out)
        console.log('[useBookingWorkflow] Workflow completed but no session_ready, redirecting anyway');
        posthog?.capture('booking_completed_via_polling_no_session_ready', { confirmation_id: runId });
        
        const clearedLeadId = clearAllBookingStorage();
        if (clearedLeadId) {
          posthog?.capture('booking_storage_cleared', {
            lead_id: clearedLeadId,
            confirmation_id: runId,
          });
        }
        
        setCurrentStep('done');
        setTimeout(() => {
          setState({ status: 'redirecting', confirmationId: runId });
          router.push(`/confirmation/${runId}`);
        }, 1000);
      } else if (data.status === 'failed' || data.status === 'cancelled') {
        // Scenario 2: Unrecoverable error
        console.log('[useBookingWorkflow] Workflow', data.status, 'via polling');
        
        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          isPollingRef.current = false;
        }
        pollingStartTimeRef.current = null;
        setConnectionMode('idle'); // Will be set appropriately by state change
        
        setError('We were unable to complete your booking. Please try again.');
        setState({ 
          status: 'error', 
          message: 'We were unable to complete your booking. Please try again.',
          showProviderAvailability: true,
        });
        posthog?.capture('booking_failed_unrecoverable', { confirmation_id: runId, status: data.status });
      } else if (data.status === 'running' || data.status === 'pending') {
        // Scenario 3: Still working, show waiting message
        if (!waitingMessageShownRef.current) {
          console.log('[useBookingWorkflow] Workflow still running, showing waiting message');
          waitingMessageShownRef.current = true;
          setState((prev) => {
            if (prev.status === 'booking' || prev.status === 'waiting') {
              return {
                status: 'waiting',
                confirmationId: runId,
                providerId: providerId,
              };
            }
            return prev;
          });
          posthog?.capture('booking_waiting_message_shown', { confirmation_id: runId });
        }
        
        // Check if we've been waiting for more than 1 minute
        if (pollingDuration >= ONE_MINUTE) {
          // Scenario 3 timeout: Show error with provider availability button
          console.log('[useBookingWorkflow] Polling timeout after 1 minute, showing error');
          
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
            isPollingRef.current = false;
          }
          pollingStartTimeRef.current = null;
          
          setError('We\'re sorry, but we ran into an error somewhere along the way, and we recommend you attempt booking again.');
          setState({
            status: 'error',
            message: 'We\'re sorry, but we ran into an error somewhere along the way, and we recommend you attempt booking again.',
            showProviderAvailability: true,
          });
          posthog?.capture('booking_polling_timeout_escape_hatch', { 
            confirmation_id: runId,
            polling_duration_ms: pollingDuration,
          });
        }
      }
    } catch (err) {
      console.error('[useBookingWorkflow] Polling error:', err);
      // Don't stop polling on error - keep trying
    }
  }, [posthog, router]);

  // Effect to start polling after 10 seconds of no messages
  useEffect(() => {
    if ((state.status !== 'booking' && state.status !== 'waiting') || !currentRunIdRef.current) {
      // Stop polling if not in booking/waiting state
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        isPollingRef.current = false;
      }
      pollingStartTimeRef.current = null;
      setConnectionMode('idle');
      return;
    }

    const checkForStaleConnection = () => {
      if (!lastMessageTimeRef.current || !currentRunIdRef.current) return;
      
      const timeSinceLastMessage = Date.now() - lastMessageTimeRef.current;
      const POLLING_THRESHOLD = 10000; // 10 seconds

      if (timeSinceLastMessage >= POLLING_THRESHOLD && !isPollingRef.current) {
        console.log('[useBookingWorkflow] No messages for', timeSinceLastMessage, 'ms, starting polling fallback');
        
        // Get providerId from state
        const providerId = state.status === 'booking' ? state.providerId : 
                          state.status === 'waiting' ? state.providerId : '';
        
        if (!providerId) {
          console.error('[useBookingWorkflow] Cannot start polling without providerId');
          return;
        }
        
        // Switch to polling mode
        setConnectionMode('polling');
        
        // Start polling every 5 seconds
        pollWorkflowStatus(currentRunIdRef.current, providerId);
        pollingIntervalRef.current = setInterval(() => {
          if (currentRunIdRef.current) {
            pollWorkflowStatus(currentRunIdRef.current, providerId);
          }
        }, 5000); // Poll every 5 seconds
      }
    };

    // Check every 2 seconds if we need to start polling
    const checkInterval = setInterval(checkForStaleConnection, 2000);

    return () => {
      clearInterval(checkInterval);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        isPollingRef.current = false;
      }
    };
  }, [state, pollWorkflowStatus]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Stop polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      isPollingRef.current = false;
    }
    
    lastMessageTimeRef.current = null;
    lastProgressIndexRef.current = 0;
    currentRunIdRef.current = null;
    currentEventIdRef.current = null;
    pollingStartTimeRef.current = null;
    waitingMessageShownRef.current = false;
    
    setState({ status: 'idle' });
    setCurrentStep(null);
    setError(null);
    setConnectionMode('idle');
    setLastMessageTime(null);
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
                      state.status === 'waiting' ||
                      state.status === 'redirecting' ||
                      (state.status === 'error' && currentStep !== null);

  const isWaiting = state.status === 'waiting';
  const showProviderAvailability = state.status === 'error' && 'showProviderAvailability' in state && state.showProviderAvailability === true;
  
  // Map internal status to BookingForm-compatible status
  const bookingFormStatus: BookingFormStatus = state.status === 'waiting' ? 'booking' : state.status;

  return {
    state,
    startBooking,
    reset,
    retry,
    isModalOpen,
    currentStep,
    error,
    isWaiting,
    showProviderAvailability,
    connectionMode,
    lastMessageTime,
    bookingFormStatus,
  };
}
