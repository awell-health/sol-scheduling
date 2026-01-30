import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { BookingProgressModal } from './BookingProgressModal';

const meta: Meta<typeof BookingProgressModal> = {
  title: 'Booking/BookingProgressModal',
  component: BookingProgressModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    currentStep: {
      control: 'select',
      options: [
        'booking_started',
        'appointment_booked',
        'careflow_started',
        'session_ready',
        'done',
        null
      ],
      description: 'Current progress step'
    },
    isWaiting: {
      control: 'boolean',
      description: 'Show waiting message'
    },
    showProviderAvailability: {
      control: 'boolean',
      description: 'Show Provider Availability button instead of retry'
    }
  }
};

export default meta;
type Story = StoryObj<typeof BookingProgressModal>;

// Step 1: Booking started
export const BookingStarted: Story = {
  args: {
    isOpen: true,
    currentStep: 'booking_started',
    error: null,
    onRetry: fn(),
    onDismiss: fn()
  }
};

// Step 2: Appointment booked
export const AppointmentBooked: Story = {
  args: {
    isOpen: true,
    currentStep: 'appointment_booked',
    error: null,
    onRetry: fn(),
    onDismiss: fn()
  }
};

// Step 3: Careflow started
export const CareflowStarted: Story = {
  args: {
    isOpen: true,
    currentStep: 'careflow_started',
    error: null,
    onRetry: fn(),
    onDismiss: fn()
  }
};

// Step 4: Session ready (done)
export const SessionReady: Story = {
  args: {
    isOpen: true,
    currentStep: 'session_ready',
    error: null,
    onRetry: fn(),
    onDismiss: fn()
  }
};

// Complete
export const Complete: Story = {
  args: {
    isOpen: true,
    currentStep: 'done',
    error: null,
    onRetry: fn(),
    onDismiss: fn()
  }
};

// With waiting message
export const WithWaitingMessage: Story = {
  args: {
    isOpen: true,
    currentStep: 'appointment_booked',
    error: null,
    isWaiting: true,
    onRetry: fn(),
    onDismiss: fn()
  }
};

// Error state
export const Error: Story = {
  args: {
    isOpen: true,
    currentStep: 'booking_started',
    error:
      'The selected time slot is no longer available. Please choose another time.',
    onRetry: fn(),
    onDismiss: fn()
  }
};

// Error at appointment booked step
export const ErrorAtAppointmentBooked: Story = {
  args: {
    isOpen: true,
    currentStep: 'appointment_booked',
    error: 'Unable to create your account. Please try again.',
    onRetry: fn(),
    onDismiss: fn()
  }
};

// Error with Provider Availability button
export const ErrorWithProviderAvailability: Story = {
  args: {
    isOpen: true,
    currentStep: 'booking_started',
    error: 'This appointment slot has been taken by another patient.',
    showProviderAvailability: true,
    onProviderAvailability: fn(),
    onDismiss: fn()
  }
};

// Closed modal (nothing renders)
export const Closed: Story = {
  args: {
    isOpen: false,
    currentStep: 'booking_started',
    error: null,
    onRetry: fn(),
    onDismiss: fn()
  }
};

// Interactive - simulating progress
const ProgressSimulation = () => {
  const [step, setStep] = React.useState<
    | 'booking_started'
    | 'appointment_booked'
    | 'careflow_started'
    | 'session_ready'
    | 'done'
  >('booking_started');
  const [isOpen, setIsOpen] = React.useState(false);

  const simulateProgress = () => {
    setIsOpen(true);
    setStep('booking_started');

    setTimeout(() => setStep('appointment_booked'), 1500);
    setTimeout(() => setStep('careflow_started'), 3000);
    setTimeout(() => setStep('session_ready'), 4500);
    setTimeout(() => setStep('done'), 5500);
    setTimeout(() => setIsOpen(false), 6500);
  };

  return (
    <div>
      <button
        onClick={simulateProgress}
        className='rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90'
      >
        Simulate Booking Progress
      </button>
      <BookingProgressModal
        isOpen={isOpen}
        currentStep={step}
        error={null}
        onRetry={() => {}}
        onDismiss={() => setIsOpen(false)}
      />
    </div>
  );
};

export const ProgressSimulationDemo: Story = {
  render: () => <ProgressSimulation />
};

// Interactive - error recovery
const ErrorRecovery = () => {
  const [step, setStep] = React.useState<
    | 'booking_started'
    | 'appointment_booked'
    | 'careflow_started'
    | 'session_ready'
    | 'done'
  >('booking_started');
  const [error, setError] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const simulateErrorAndRetry = () => {
    setIsOpen(true);
    setStep('booking_started');
    setError(null);

    setTimeout(() => {
      setError('Failed to book appointment. Please try again.');
    }, 2000);
  };

  const handleRetry = () => {
    setError(null);
    setStep('booking_started');

    setTimeout(() => setStep('appointment_booked'), 1500);
    setTimeout(() => setStep('careflow_started'), 3000);
    setTimeout(() => setStep('session_ready'), 4500);
    setTimeout(() => {
      setStep('done');
      setIsOpen(false);
    }, 5500);
  };

  return (
    <div>
      <button
        onClick={simulateErrorAndRetry}
        className='rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600'
      >
        Simulate Error & Recovery
      </button>
      <BookingProgressModal
        isOpen={isOpen}
        currentStep={step}
        error={error}
        onRetry={handleRetry}
        onDismiss={() => setIsOpen(false)}
      />
    </div>
  );
};

export const ErrorRecoveryDemo: Story = {
  render: () => <ErrorRecovery />
};
