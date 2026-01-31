import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

// Create mock functions outside vi.mock factory
const mockGetProviderAction = vi.fn();
const mockPostHogCapture = vi.fn();

// Create a stable PostHog mock object (to avoid infinite re-renders from dependency array)
const mockPostHog = {
  capture: (...args: unknown[]) => mockPostHogCapture(...args)
};

// Mock the server action
vi.mock('../../actions', () => ({
  getProviderAction: (...args: unknown[]) => mockGetProviderAction(...args)
}));

// Mock PostHog - return stable reference
vi.mock('posthog-js/react', () => ({
  usePostHog: () => mockPostHog
}));

import { useProvider } from './useProvider';

describe('useProvider', () => {
  const mockProvider = {
    id: 'provider-123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    title: 'MD',
    bio: 'Board-certified psychiatrist',
    specialties: ['ADHD', 'Anxiety'],
    image: 'https://example.com/sarah.jpg'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetProviderAction.mockResolvedValue({
      data: mockProvider,
      _timing: { solApiMs: 100 }
    });
  });

  it('returns loading state initially', async () => {
    const { result } = renderHook(() => useProvider('provider-123'));

    // Initial state should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.provider).toBeNull();
    expect(result.current.error).toBeNull();

    // Wait for hook to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  it('fetches provider data on mount', async () => {
    const { result } = renderHook(() => useProvider('provider-123'));

    // Wait for async operation to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.provider).toEqual(mockProvider);
    expect(result.current.error).toBeNull();
    expect(mockGetProviderAction).toHaveBeenCalledWith('provider-123');
  });

  it('tracks API call timing with PostHog', async () => {
    const { result } = renderHook(() => useProvider('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockPostHogCapture).toHaveBeenCalledWith(
      'api_call_provider',
      expect.objectContaining({
        provider_id: 'provider-123',
        sol_api_rt_ms: 100
      })
    );
  });

  it('handles API errors', async () => {
    mockGetProviderAction.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProvider('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.provider).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('uses generic error message for non-Error objects', async () => {
    mockGetProviderAction.mockRejectedValue('Unknown error');

    const { result } = renderHook(() => useProvider('provider-123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Unable to load provider details');
  });

  it('refetches when providerId changes', async () => {
    const { result, rerender } = renderHook(
      ({ providerId }) => useProvider(providerId),
      { initialProps: { providerId: 'provider-123' } }
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetProviderAction).toHaveBeenCalledTimes(1);

    // Change provider ID
    mockGetProviderAction.mockResolvedValue({
      data: { ...mockProvider, id: 'provider-456', firstName: 'Michael' },
      _timing: { solApiMs: 50 }
    });

    rerender({ providerId: 'provider-456' });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(result.current.provider?.firstName).toBe('Michael');
    });

    expect(mockGetProviderAction).toHaveBeenCalledTimes(2);
    expect(mockGetProviderAction).toHaveBeenLastCalledWith('provider-456');
  });

  it('cancels pending request on unmount', async () => {
    const { unmount } = renderHook(() => useProvider('provider-123'));

    // Unmount immediately before request completes
    unmount();

    // Verify no errors occur
    await new Promise((resolve) => setTimeout(resolve, 50));
  });
});
