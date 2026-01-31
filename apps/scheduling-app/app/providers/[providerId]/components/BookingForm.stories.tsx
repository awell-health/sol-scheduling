import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { BookingForm, type BookingFormStatus } from './BookingForm';
import type { AvailabilitySlot } from '../../_lib/types';
import type { OnboardingPreferences } from '../../_lib/onboarding';

// Helper to generate a future date
const generateFutureDate = (daysFromNow: number, hour: number = 9) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
};

// Mock telehealth slot
const mockTelehealthSlot: AvailabilitySlot = {
  eventId: 'slot-telehealth',
  date: generateFutureDate(1),
  providerId: 'provider-1',
  slotstart: generateFutureDate(1, 9),
  duration: 60,
  facility: 'CO - Cherry Creek',
  eventType: 'Telehealth',
  location: 'Telehealth',
  booked: false
} as AvailabilitySlot;

// Mock in-person slot
const mockInPersonSlot: AvailabilitySlot = {
  eventId: 'slot-in-person',
  date: generateFutureDate(2),
  providerId: 'provider-1',
  slotstart: generateFutureDate(2, 14),
  duration: 60,
  facility: 'CO - Cherry Creek',
  eventType: 'In-Person',
  location: 'In-Person',
  booked: false
} as AvailabilitySlot;

// Mock hybrid slot (both in-person and telehealth available)
const mockHybridSlot: AvailabilitySlot = {
  eventId: 'slot-hybrid',
  date: generateFutureDate(3),
  providerId: 'provider-1',
  slotstart: generateFutureDate(3, 10),
  duration: 60,
  facility: 'CO - Boulder',
  eventType: 'In-Person', // In-person also supports virtual
  location: 'In-Person',
  booked: false
} as AvailabilitySlot;

// Mock preferences
const emptyPreferences: OnboardingPreferences = {
  state: null,
  service: null,
  phone: null,
  insurance: null,
  consent: null
};

const prefilledPreferences: OnboardingPreferences = {
  state: 'CO',
  service: 'medication',
  phone: '+12025551234',
  insurance: 'bcbs',
  consent: true
};

const partialPreferences: OnboardingPreferences = {
  state: 'CO',
  service: 'medication',
  phone: '+12025551234',
  insurance: null,
  consent: false
};

const meta: Meta<typeof BookingForm> = {
  title: 'Booking/BookingForm',
  component: BookingForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  },
  decorators: [
    (Story) => (
      <div className='max-w-2xl mx-auto'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    bookingStatus: {
      control: 'select',
      options: [
        'idle',
        'starting',
        'booking',
        'redirecting',
        'error',
        'success'
      ],
      description: 'Current booking workflow status'
    }
  }
};

export default meta;
type Story = StoryObj<typeof BookingForm>;

// Default - telehealth slot, empty preferences
export const Default: Story = {
  args: {
    selectedSlot: mockTelehealthSlot,
    preferences: emptyPreferences,
    bookingStatus: 'idle',
    bookingError: null,
    isModalOpen: false,
    onClearSlot: fn(),
    onSubmit: fn(),
    onResetWorkflow: fn()
  }
};

// With pre-filled preferences
export const PrefilledFromOnboarding: Story = {
  args: {
    selectedSlot: mockTelehealthSlot,
    preferences: prefilledPreferences,
    bookingStatus: 'idle',
    bookingError: null,
    isModalOpen: false,
    onClearSlot: fn(),
    onSubmit: fn(),
    onResetWorkflow: fn()
  }
};

// Partial preferences (some fields still needed)
export const PartialPreferences: Story = {
  args: {
    selectedSlot: mockTelehealthSlot,
    preferences: partialPreferences,
    bookingStatus: 'idle',
    bookingError: null,
    isModalOpen: false,
    onClearSlot: fn(),
    onSubmit: fn(),
    onResetWorkflow: fn()
  }
};

// In-person slot
export const InPersonSlot: Story = {
  args: {
    selectedSlot: mockInPersonSlot,
    preferences: emptyPreferences,
    bookingStatus: 'idle',
    bookingError: null,
    isModalOpen: false,
    onClearSlot: fn(),
    onSubmit: fn(),
    onResetWorkflow: fn()
  }
};

// Hybrid slot (needs visit mode selection)
export const HybridSlot: Story = {
  args: {
    selectedSlot: mockHybridSlot,
    preferences: emptyPreferences,
    bookingStatus: 'idle',
    bookingError: null,
    isModalOpen: false,
    onClearSlot: fn(),
    onSubmit: fn(),
    onResetWorkflow: fn()
  }
};

// Booking in progress
export const BookingInProgress: Story = {
  args: {
    selectedSlot: mockTelehealthSlot,
    preferences: prefilledPreferences,
    bookingStatus: 'booking',
    bookingError: null,
    isModalOpen: true,
    onClearSlot: fn(),
    onSubmit: fn(),
    onResetWorkflow: fn()
  }
};

// Starting booking
export const StartingBooking: Story = {
  args: {
    selectedSlot: mockTelehealthSlot,
    preferences: prefilledPreferences,
    bookingStatus: 'starting',
    bookingError: null,
    isModalOpen: false,
    onClearSlot: fn(),
    onSubmit: fn(),
    onResetWorkflow: fn()
  }
};

// Error state (modal closed, error shown inline)
export const ErrorState: Story = {
  args: {
    selectedSlot: mockTelehealthSlot,
    preferences: prefilledPreferences,
    bookingStatus: 'error',
    bookingError:
      'The selected time slot is no longer available. Please choose another time.',
    isModalOpen: false,
    onClearSlot: fn(),
    onSubmit: fn(),
    onResetWorkflow: fn()
  }
};

// Redirecting
export const Redirecting: Story = {
  args: {
    selectedSlot: mockTelehealthSlot,
    preferences: prefilledPreferences,
    bookingStatus: 'redirecting',
    bookingError: null,
    isModalOpen: true,
    onClearSlot: fn(),
    onSubmit: fn(),
    onResetWorkflow: fn()
  }
};

// Mobile viewport
export const Mobile: Story = {
  args: {
    selectedSlot: mockTelehealthSlot,
    preferences: emptyPreferences,
    bookingStatus: 'idle',
    bookingError: null,
    isModalOpen: false,
    onClearSlot: fn(),
    onSubmit: fn(),
    onResetWorkflow: fn()
  },
  globals: {
    viewport: {
      value: 'mobile',
      isRotated: false
    }
  }
};

// Interactive - controlled component
const ControlledBookingForm = () => {
  const [status, setStatus] = React.useState<BookingFormStatus>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSubmit = async () => {
    setStatus('starting');
    setError(null);

    // Simulate booking process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus('booking');
    setIsModalOpen(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus('redirecting');

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus('success');
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setStatus('idle');
    setError(null);
    setIsModalOpen(false);
  };

  return (
    <div className='space-y-4'>
      <div className='text-sm text-slate-600'>
        Status: <span className='font-mono'>{status}</span>
      </div>
      <BookingForm
        selectedSlot={mockTelehealthSlot}
        preferences={partialPreferences}
        bookingStatus={status}
        bookingError={error}
        isModalOpen={isModalOpen}
        onClearSlot={handleReset}
        onSubmit={handleSubmit}
        onResetWorkflow={handleReset}
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <ControlledBookingForm />
};
