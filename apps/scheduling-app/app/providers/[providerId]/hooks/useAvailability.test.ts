import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

// Create mock functions outside vi.mock factory
const mockGetAvailabilityAction = vi.fn();
const mockPostHogCapture = vi.fn();

// Create a stable PostHog mock object (to avoid infinite re-renders from dependency array)
const mockPostHog = {
  capture: (...args: unknown[]) => mockPostHogCapture(...args)
};

// Mock the server action
vi.mock('../../actions', () => ({
  getAvailabilityAction: (...args: unknown[]) =>
    mockGetAvailabilityAction(...args)
}));

// Mock PostHog - return stable reference
vi.mock('posthog-js/react', () => ({
  usePostHog: () => mockPostHog
}));

// Mock date-fns
vi.mock('date-fns', async () => {
  const actual = await vi.importActual('date-fns');
  return {
    ...actual,
    startOfToday: () => new Date('2024-06-15T00:00:00Z')
  };
});

import { useAvailability, getLocalDayKey } from './useAvailability';

describe('useAvailability', () => {
  const mockSlots = [
    {
      eventId: 'event-1',
      providerId: 'provider-123',
      slotstart: '2024-06-20T14:00:00Z',
      duration: 60,
      location: 'Telehealth',
      eventType: 'Telehealth',
      booked: false
    },
    {
      eventId: 'event-2',
      providerId: 'provider-123',
      slotstart: '2024-06-20T16:00:00Z',
      duration: 60,
      location: 'In-Person',
      eventType: 'In-Person',
      booked: false
    },
    {
      eventId: 'event-3',
      providerId: 'provider-123',
      slotstart: '2024-06-21T10:00:00Z',
      duration: 60,
      location: 'Telehealth',
      eventType: 'Telehealth',
      booked: true // Already booked
    },
    {
      eventId: 'event-4',
      providerId: 'provider-123',
      slotstart: '2024-06-21T14:00:00Z',
      duration: 60,
      location: 'Telehealth',
      eventType: 'Telehealth',
      booked: false
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Date.now to return a fixed time (before the slots)
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));

    mockGetAvailabilityAction.mockResolvedValue({
      data: { 'provider-123': mockSlots },
      _timing: { solApiMs: 100 }
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns loading state initially', async () => {
    const { result } = renderHook(() => useAvailability('provider-123'));

    expect(result.current.loading).toBe(true);
    expect(result.current.slots).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for hook to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  it('fetches availability data on mount', async () => {
    const { result } = renderHook(() => useAvailability('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.slots).toHaveLength(4);
    expect(result.current.error).toBeNull();
    expect(mockGetAvailabilityAction).toHaveBeenCalledWith('provider-123');
  });

  it('sorts slots by start time', async () => {
    const { result } = renderHook(() => useAvailability('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const times = result.current.slots.map((s) => s.slotstart);
    expect(times).toEqual([
      '2024-06-20T14:00:00Z',
      '2024-06-20T16:00:00Z',
      '2024-06-21T10:00:00Z',
      '2024-06-21T14:00:00Z'
    ]);
  });

  it('filters to only upcoming unbooked slots', async () => {
    const { result } = renderHook(() => useAvailability('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should exclude booked slot (event-3)
    expect(result.current.upcomingSlots).toHaveLength(3);
    expect(
      result.current.upcomingSlots.find((s) => s.eventId === 'event-3')
    ).toBeUndefined();
  });

  it('derives unique location options from slots', async () => {
    const { result } = renderHook(() => useAvailability('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.locationOptions).toContain('Telehealth');
    expect(result.current.locationOptions).toContain('In-Person');
    expect(result.current.locationOptions).toHaveLength(2);
  });

  it('filters slots by location', async () => {
    const { result } = renderHook(() => useAvailability('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Initially shows all
    expect(result.current.filteredSlots).toHaveLength(3);

    // Filter to Telehealth only
    act(() => {
      result.current.setLocationFilter('Telehealth');
    });

    expect(result.current.filteredSlots).toHaveLength(2);
    expect(
      result.current.filteredSlots.every((s) => s.location === 'Telehealth')
    ).toBe(true);
  });

  it('builds day-to-slots map', async () => {
    const { result } = renderHook(() => useAvailability('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const daySlotMap = result.current.daySlotMap;

    // June 20 should have 2 unbooked slots
    const june20Key = '2024-06-20';
    expect(daySlotMap.get(june20Key)).toHaveLength(2);

    // June 21 should have 1 unbooked slot (event-3 is booked)
    const june21Key = '2024-06-21';
    expect(daySlotMap.get(june21Key)).toHaveLength(1);
  });

  it('returns array of dates with slots', async () => {
    const { result } = renderHook(() => useAvailability('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.daysWithSlots).toHaveLength(2);
  });

  it('calculates default month from first available slot', async () => {
    const { result } = renderHook(() => useAvailability('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // First slot is June 20, so default month should be June 2024
    expect(result.current.defaultMonth.getMonth()).toBe(5); // 0-indexed
    expect(result.current.defaultMonth.getFullYear()).toBe(2024);
  });

  it('handles no availability', async () => {
    mockGetAvailabilityAction.mockResolvedValue({
      data: { 'provider-123': [] },
      _timing: { solApiMs: 50 }
    });

    const { result } = renderHook(() => useAvailability('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.slots).toEqual([]);
    expect(result.current.upcomingSlots).toEqual([]);
    expect(result.current.locationOptions).toEqual([]);
    expect(result.current.filteredSlots).toEqual([]);
  });

  it('handles API errors', async () => {
    mockGetAvailabilityAction.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAvailability('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.slots).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  it('tracks API call timing with PostHog', async () => {
    const { result } = renderHook(() => useAvailability('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockPostHogCapture).toHaveBeenCalledWith(
      'api_call_availability',
      expect.objectContaining({
        provider_id: 'provider-123',
        sol_api_rt_ms: 100,
        slot_count: 4
      })
    );
  });

  it('location filter defaults to "all"', () => {
    const { result } = renderHook(() => useAvailability('provider-123'));

    expect(result.current.locationFilter).toBe('all');
  });
});

describe('getLocalDayKey', () => {
  it('formats date as YYYY-MM-DD in local timezone', () => {
    const date = new Date('2024-06-20T14:00:00Z');
    const key = getLocalDayKey(date);

    // The exact output depends on the local timezone, but should be in YYYY-MM-DD format
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('handles single digit months and days', () => {
    const date = new Date('2024-01-05T10:00:00Z');
    const key = getLocalDayKey(date);

    // Should pad with zeros
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
