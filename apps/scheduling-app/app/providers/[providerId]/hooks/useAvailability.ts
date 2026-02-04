'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { AvailabilitySlot } from '../../_lib/types';
import { getAvailabilityAction } from '../../actions';
import { startOfToday } from 'date-fns';

export interface UseAvailabilityResult {
  /** All slots for this provider */
  slots: AvailabilitySlot[];
  /** Loading state */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Upcoming unbooked slots */
  upcomingSlots: AvailabilitySlot[];
  /** Available location options derived from slots */
  locationOptions: string[];
  /** Filtered slots based on location filter */
  filteredSlots: AvailabilitySlot[];
  /** Map of day key -> slots for that day */
  daySlotMap: Map<string, AvailabilitySlot[]>;
  /** Array of dates that have slots */
  daysWithSlots: Date[];
  /** Current location filter value */
  locationFilter: string;
  /** Set the location filter */
  setLocationFilter: (filter: string) => void;
  /** Default month to show in calendar (month of first available slot) */
  defaultMonth: Date;
}

/**
 * Get a local day key string (YYYY-MM-DD) from a date.
 */
function getLocalDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Hook to fetch and manage provider availability data.
 */
export function useAvailability(providerId: string): UseAvailabilityResult {
  const posthog = usePostHog();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('all');

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      const frontendStart = performance.now();
      try {
        setLoading(true);
        setError(null);
        const response = await getAvailabilityAction(providerId);
        const frontendMs = Math.round(performance.now() - frontendStart);

        const providerSlots = response.data?.[providerId] ?? [];
        const sortedSlots = providerSlots
          .map((slot) => ({
            ...slot,
            slotstart: slot.slotstart
          }))
          .sort(
            (first, second) =>
              new Date(first.slotstart).getTime() -
              new Date(second.slotstart).getTime()
          );

        if (!cancelled) {
          setSlots(sortedSlots);

          posthog?.capture('api_call_availability', {
            provider_id: providerId,
            frontend_rt_ms: frontendMs,
            sol_api_rt_ms: response._timing?.solApiMs,
            slot_count: sortedSlots.length
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Unable to load availability'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [providerId, posthog]);

  // Filter to only upcoming, unbooked slots
  const upcomingSlots = useMemo(() => {
    const now = Date.now();
    return slots.filter(
      (slot) => new Date(slot.slotstart).getTime() > now && slot.booked !== true
    );
  }, [slots]);

  // Derive available location options from slots
  const locationOptions = useMemo(() => {
    const modes = new Set<string>();
    upcomingSlots.forEach((slot) => {
      const mode = slot.location ?? slot.eventType;
      if (mode) modes.add(mode);
    });
    return Array.from(modes);
  }, [upcomingSlots]);

  // Filter slots by location
  const filteredSlots = useMemo(() => {
    if (locationFilter === 'all') return upcomingSlots;
    return upcomingSlots.filter(
      (slot) => (slot.location ?? slot.eventType) === locationFilter
    );
  }, [upcomingSlots, locationFilter]);

  // Build day -> slots map
  const daySlotMap = useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>();

    filteredSlots.forEach((slot) => {
      const date = new Date(slot.slotstart);
      const key = getLocalDayKey(date);
      const existing = map.get(key);
      if (existing) {
        existing.push(slot);
      } else {
        map.set(key, [slot]);
      }
    });

    return map;
  }, [filteredSlots]);

  // Get array of dates that have slots
  const daysWithSlots = useMemo(
    () =>
      Array.from(daySlotMap.keys()).map((key) => {
        const [year, month, day] = key.split('-').map(Number);
        return new Date(year, month - 1, day);
      }),
    [daySlotMap]
  );

  // Calculate default month to show (month of first available slot)
  const defaultMonth = useMemo(() => {
    if (filteredSlots.length === 0) return startOfToday();
    const firstSlotDate = new Date(filteredSlots[0].slotstart);
    return new Date(firstSlotDate.getFullYear(), firstSlotDate.getMonth(), 1);
  }, [filteredSlots]);

  return {
    slots,
    loading,
    error,
    upcomingSlots,
    locationOptions,
    filteredSlots,
    daySlotMap,
    daysWithSlots,
    locationFilter,
    setLocationFilter,
    defaultMonth
  };
}

export { getLocalDayKey };
