import { useState, useEffect, useRef } from 'react';
import { getWorkflowStatusAction, type WorkflowStatusResult } from '../confirmation/actions';
import type { BookingWorkflowResult } from '../../lib/workflow';

export interface UseConfirmationDataResult {
  /** Whether the data is currently loading */
  isLoading: boolean;
  /** The confirmation data when completed */
  data: BookingWorkflowResult | null;
  /** Error message if any */
  error: string | null;
}

/**
 * Hook to poll workflow status until completion or error.
 * Polls every 2 seconds until the workflow is completed or errors.
 * 
 * @param confirmationId - The workflow run ID (confirmation ID)
 * @returns Loading state, data, and error
 */
export function useConfirmationData(
  confirmationId: string
): UseConfirmationDataResult {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<BookingWorkflowResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(true);

  useEffect(() => {
    if (!confirmationId) {
      setIsLoading(false);
      setError('No confirmation ID provided');
      return;
    }

    const pollStatus = async () => {
      if (!isPollingRef.current) {
        return;
      }

      try {
        const result: WorkflowStatusResult = await getWorkflowStatusAction(confirmationId);

        if (result.status === 'completed') {
          setData(result.result);
          setIsLoading(false);
          isPollingRef.current = false;
          
          // Clear interval if it exists
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else if (result.status === 'error') {
          setError(result.message);
          setIsLoading(false);
          isPollingRef.current = false;
          
          // Clear interval if it exists
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        // If status is 'running', continue polling
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to check workflow status';
        setError(message);
        setIsLoading(false);
        isPollingRef.current = false;
        
        // Clear interval if it exists
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    // Poll immediately on mount
    pollStatus();

    // Then poll every 2 seconds
    intervalRef.current = setInterval(pollStatus, 2000);

    // Cleanup function
    return () => {
      isPollingRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [confirmationId]);

  return {
    isLoading,
    data,
    error,
  };
}

