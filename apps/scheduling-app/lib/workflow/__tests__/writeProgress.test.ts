import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create mock functions first
const mockWrite = vi.fn().mockResolvedValue(undefined);
const mockReleaseLock = vi.fn();
const mockClose = vi.fn().mockResolvedValue(undefined);
const mockGetWriter = vi.fn().mockReturnValue({
  write: mockWrite,
  releaseLock: mockReleaseLock
});

// Mock the workflow module - use a function that returns values to avoid hoisting issues
vi.mock('workflow', () => ({
  getWritable: () => ({
    getWriter: () => ({
      write: mockWrite,
      releaseLock: mockReleaseLock
    }),
    close: mockClose
  })
}));

import {
  writeProgressStep,
  closeProgressStreamStep,
  type BookingProgressType
} from '../steps/writeProgress';

describe('writeProgressStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-20T10:30:00.000Z'));

    // Reset mock implementations
    mockWrite.mockResolvedValue(undefined);
    mockClose.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('successful writes', () => {
    it('writes progress update with timestamp', async () => {
      await writeProgressStep({
        type: 'booking_started',
        message: 'Starting booking process...'
      });

      expect(mockWrite).toHaveBeenCalledWith({
        type: 'booking_started',
        message: 'Starting booking process...',
        timestamp: '2024-06-20T10:30:00.000Z'
      });
    });

    it('includes data when provided', async () => {
      await writeProgressStep({
        type: 'appointment_booked',
        message: 'Appointment booked successfully',
        data: {
          eventId: 'event-123',
          confirmationId: 'conf-456'
        }
      });

      expect(mockWrite).toHaveBeenCalledWith({
        type: 'appointment_booked',
        message: 'Appointment booked successfully',
        data: {
          eventId: 'event-123',
          confirmationId: 'conf-456'
        },
        timestamp: '2024-06-20T10:30:00.000Z'
      });
    });

    it('releases writer lock after successful write', async () => {
      await writeProgressStep({
        type: 'booking_started',
        message: 'Test message'
      });

      expect(mockReleaseLock).toHaveBeenCalled();
    });

    it('handles all progress types', async () => {
      const progressTypes: BookingProgressType[] = [
        'booking_started',
        'appointment_booked',
        'careflow_started',
        'session_ready',
        'error'
      ];

      for (const type of progressTypes) {
        vi.clearAllMocks();
        await writeProgressStep({
          type,
          message: `Message for ${type}`
        });

        expect(mockWrite).toHaveBeenCalledWith(
          expect.objectContaining({ type })
        );
      }
    });
  });

  describe('error progress type', () => {
    it('includes error message in data', async () => {
      await writeProgressStep({
        type: 'error',
        message: 'Booking failed',
        data: {
          error: 'The selected time slot is no longer available'
        }
      });

      expect(mockWrite).toHaveBeenCalledWith({
        type: 'error',
        message: 'Booking failed',
        data: {
          error: 'The selected time slot is no longer available'
        },
        timestamp: '2024-06-20T10:30:00.000Z'
      });
    });
  });

  describe('session_ready progress', () => {
    it('includes session URL in data', async () => {
      await writeProgressStep({
        type: 'session_ready',
        message: 'Intake session ready',
        data: {
          sessionUrl: 'https://awell.health/session/abc123',
          careflowId: 'careflow-789',
          patientId: 'patient-456'
        }
      });

      expect(mockWrite).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'session_ready',
          data: expect.objectContaining({
            sessionUrl: 'https://awell.health/session/abc123'
          })
        })
      );
    });
  });

  describe('timeout handling', () => {
    it('releases lock even when write fails', async () => {
      mockWrite.mockRejectedValueOnce(new Error('Write failed'));

      await writeProgressStep({
        type: 'booking_started',
        message: 'Test message'
      });

      expect(mockReleaseLock).toHaveBeenCalled();
    });
  });
});

describe('closeProgressStreamStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClose.mockResolvedValue(undefined);
  });

  it('closes the writable stream', async () => {
    await closeProgressStreamStep();

    expect(mockClose).toHaveBeenCalled();
  });

  it('handles close errors', async () => {
    mockClose.mockRejectedValueOnce(new Error('Stream already closed'));

    // Should throw - close errors bubble up
    await expect(closeProgressStreamStep()).rejects.toThrow(
      'Stream already closed'
    );
  });
});

describe('BookingProgress types', () => {
  // Compile-time type checking tests
  it('allows valid progress types', () => {
    const validProgress: Parameters<typeof writeProgressStep>[0] = {
      type: 'booking_started',
      message: 'Test'
    };

    expect(validProgress.type).toBe('booking_started');
  });

  it('allows optional data field', () => {
    const withData: Parameters<typeof writeProgressStep>[0] = {
      type: 'session_ready',
      message: 'Ready',
      data: {
        sessionUrl: 'https://example.com'
      }
    };

    expect(withData.data?.sessionUrl).toBe('https://example.com');
  });
});
