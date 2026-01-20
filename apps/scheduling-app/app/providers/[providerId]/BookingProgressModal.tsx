'use client';

import { useEffect, useMemo } from 'react';
import { CheckCircle2, Loader2, Circle, AlertCircle, RefreshCw, X } from 'lucide-react';
import type { BookingProgressType } from '@/lib/workflow';
import clsx from 'clsx';

type StepStatus = 'pending' | 'active' | 'complete' | 'error';

interface ProgressStep {
  id: BookingProgressType | 'done';
  label: string;
  status: StepStatus;
}

interface BookingProgressModalProps {
  isOpen: boolean;
  currentStep: BookingProgressType | 'done' | null;
  error?: string | null;
  /** Whether to show "waiting" message */
  isWaiting?: boolean;
  /** Whether to show "Provider Availability" button */
  showProviderAvailability?: boolean;
  /** Called when user clicks "Try Again" */
  onRetry?: () => void;
  /** Called when user clicks "Cancel" / dismiss */
  onDismiss?: () => void;
  /** Called when user clicks "Provider Availability" */
  onProviderAvailability?: () => void;
}

/**
 * Modal that shows booking progress with step-by-step checkmarks.
 * 
 * Steps:
 * 1. "Confirming the date/time of your appointment..." (booking_started → appointment_booked)
 * 2. "Coordinating with your provider..." (appointment_booked → careflow_started)
 * 3. "Ensuring your intake forms are ready..." (careflow_started → session_ready)
 * 4. "Done! Redirecting..." (session_ready → done)
 * 
 * On error, shows an error state with retry and cancel buttons.
 */
export function BookingProgressModal({ 
  isOpen, 
  currentStep, 
  error,
  isWaiting = false,
  showProviderAvailability = false,
  onRetry,
  onDismiss,
  onProviderAvailability,
}: BookingProgressModalProps) {
  // Determine step statuses based on current progress
  const steps = useMemo((): ProgressStep[] => {
    const stepOrder: (BookingProgressType | 'done')[] = [
      'booking_started',
      'appointment_booked',
      'careflow_started',
      'session_ready',
      'done',
    ];

    const labels: Record<BookingProgressType | 'done', string> = {
      booking_started: 'Reserving the date/time of your appointment...',
      appointment_booked: 'Creating an account with our team...',
      careflow_started: 'Loading a few intake questions...',
      session_ready: 'Done! Redirecting...',
      done: 'Done! Redirecting...',
      error: 'Error',
    };

    // Map step types to display steps (we show 4 steps, not 5)
    const displaySteps: { type: BookingProgressType | 'done'; label: string }[] = [
      { type: 'booking_started', label: labels.booking_started },
      { type: 'appointment_booked', label: labels.appointment_booked },
      { type: 'careflow_started', label: labels.careflow_started },
      { type: 'session_ready', label: labels.session_ready },
    ];

    const currentIndex = currentStep ? stepOrder.indexOf(currentStep) : -1;

    return displaySteps.map((step) => {
      const stepIndex = stepOrder.indexOf(step.type);
      let status: StepStatus = 'pending';
      
      // If there's an error, mark the current step as error
      if (error && currentIndex === stepIndex) {
        status = 'error';
      } else if (currentIndex > stepIndex) {
        status = 'complete';
      } else if (currentIndex === stepIndex) {
        status = 'active';
      }
      
      // Special case: session_ready means we're done, show as complete
      if (!error) {
        if (currentStep === 'session_ready' && step.type === 'session_ready') {
          status = 'complete';
        }
        if (currentStep === 'done' && step.type === 'session_ready') {
          status = 'complete';
        }
      }
      
      return {
        id: step.type,
        label: step.label,
        status,
      };
    });
  }, [currentStep, error]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={error ? onDismiss : undefined}
      />
      
      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close button - only show on error */}
        {error && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">
          {error ? 'Booking Issue' : 'Booking Your Appointment'}
        </h2>
        
        {/* Waiting message */}
        {isWaiting && !error && (
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <p className="text-center text-sm text-blue-700">
              Thank you for waiting! Things are still working...
            </p>
          </div>
        )}
        
        {/* Progress steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 transition-opacity duration-300 ${
                step.status === 'pending' ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {/* Status icon */}
              <div className="flex-shrink-0 pt-0.5">
                {step.status === 'complete' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : step.status === 'active' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : step.status === 'error' ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
              </div>
              
              {/* Label */}
              <p
                className={clsx(
                  'text-sm leading-relaxed text-gray-400',
                  {
                    'font-medium text-gray-900': step.status === 'active',
                    'font-medium text-red-700': step.status === 'error',
                    'text-red-700': step.status === 'error' && step.label !== 'Done! Redirecting...',
                  }
                )}
              >
                {step.status === 'error' ? 'Something went wrong' : step.label}
              </p>
            </div>
          ))}
        </div>

        {/* Error message and actions */}
        {error && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-center text-sm text-red-700">
                {error}
              </p>
            </div>
            
            <div className="flex gap-3">
              {showProviderAvailability && onProviderAvailability ? (
                <button
                  type="button"
                  onClick={onProviderAvailability}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Provider Availability
                </button>
              ) : (
                <>
                  {onDismiss && (
                    <button
                      type="button"
                      onClick={onDismiss}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                  {onRetry && (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
