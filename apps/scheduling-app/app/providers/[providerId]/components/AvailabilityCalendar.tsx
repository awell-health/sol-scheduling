'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { format, startOfToday } from 'date-fns';
import { DayButton, type DayButtonProps } from 'react-day-picker';
import { Calendar } from '../../../../components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../components/ui/select';
import { Button } from '../../../../components/ui/button';
import {
  MapPinIcon,
  VideoCameraIcon
} from '../../components/icons/ProviderIcons';
import { AvailabilitySlot } from '../../_lib/types';
import { getLocalDayKey } from '../hooks';

interface AvailabilityCalendarProps {
  /** Whether availability is loading */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Filtered slots to display */
  filteredSlots: AvailabilitySlot[];
  /** All slots (for URL-based selection) */
  allSlots: AvailabilitySlot[];
  /** Map of day key -> slots */
  daySlotMap: Map<string, AvailabilitySlot[]>;
  /** Dates that have slots */
  daysWithSlots: Date[];
  /** Location filter options */
  locationOptions: string[];
  /** Current location filter value */
  locationFilter: string;
  /** Set location filter */
  onLocationFilterChange: (filter: string) => void;
  /** Currently selected slot */
  selectedSlot: AvailabilitySlot | null;
  /** Handler when a slot is selected */
  onSlotSelect: (slot: AvailabilitySlot) => void;
  /** Default month to show in calendar */
  defaultMonth: Date;
}

/**
 * Custom day button showing slot count for each day.
 */
const SlotDayButton: React.FC<
  DayButtonProps & { daySlotMap: Map<string, AvailabilitySlot[]> }
> = (props) => {
  const { day, modifiers, daySlotMap, ...buttonProps } = props;
  const date = day.date;
  const key = getLocalDayKey(date);
  const count = daySlotMap.get(key)?.length ?? 0;
  const today = startOfToday();
  const isFuture = date >= today;
  const hasSlots = count > 0 && isFuture;

  let secondaryLabel: string | null = null;
  if (isFuture) {
    secondaryLabel = count > 0 ? String(count) : '-';
  }

  return (
    <DayButton {...buttonProps} day={day} modifiers={modifiers}>
      <div className='flex h-9 w-9 flex-col items-center justify-center gap-0.5 rounded-md leading-none'>
        <span>{date.getDate()}</span>
        {secondaryLabel && (
          <span
            className={
              hasSlots
                ? 'text-[10px] font-semibold text-emerald-700'
                : 'text-[10px] font-medium text-slate-400'
            }
          >
            {secondaryLabel}
          </span>
        )}
      </div>
    </DayButton>
  );
};

/**
 * Get slot location modes (in-person and/or virtual).
 */
function getSlotModes(slot: AvailabilitySlot) {
  const mode = slot.location ?? slot.eventType;
  const isTelehealth = mode === 'Telehealth';
  const isInPerson = mode === 'In-Person';

  // Business rule: any in-person visit can also be virtual
  return {
    inPerson: isInPerson,
    virtual: isTelehealth || isInPerson
  };
}

/**
 * Calendar with slot selection for booking appointments.
 */
export function AvailabilityCalendar({
  loading,
  error,
  filteredSlots,
  allSlots,
  daySlotMap,
  daysWithSlots,
  locationOptions,
  locationFilter,
  onLocationFilterChange,
  selectedSlot,
  onSlotSelect,
  defaultMonth
}: AvailabilityCalendarProps) {
  const searchParams = useSearchParams();
  const hasInitializedFromUrl = useRef(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Calculate default selected date (first slot date)
  const defaultSelectedDate = useMemo(() => {
    if (filteredSlots.length === 0) return undefined;
    return new Date(filteredSlots[0].slotstart);
  }, [filteredSlots]);

  // Sync selected date with default when filteredSlots change
  useEffect(() => {
    setSelectedDate(defaultSelectedDate);
  }, [defaultSelectedDate?.getTime()]);

  // Initialize from URL eventId parameter
  useEffect(() => {
    if (hasInitializedFromUrl.current) return;
    if (loading || allSlots.length === 0) return;

    const eventIdFromUrl = searchParams.get('eventId');
    if (!eventIdFromUrl) {
      hasInitializedFromUrl.current = true;
      return;
    }

    const matchingSlot = allSlots.find(
      (slot) => slot.eventId === eventIdFromUrl
    );
    if (matchingSlot) {
      const matchDate = new Date(matchingSlot.slotstart);
      setSelectedDate(matchDate);
      onSlotSelect(matchingSlot);
    }

    hasInitializedFromUrl.current = true;
  }, [loading, allSlots, searchParams, onSlotSelect]);

  // Get slots for selected date
  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const key = getLocalDayKey(selectedDate);
    return daySlotMap.get(key) ?? [];
  }, [selectedDate, daySlotMap]);

  const renderSlot = (slot: AvailabilitySlot) => {
    const startsAt = new Date(slot.slotstart);
    const time = format(startsAt, 'h:mm a');
    const { inPerson, virtual } = getSlotModes(slot);
    const isSelected = selectedSlot?.eventId === slot.eventId;

    return (
      <li
        key={slot.eventId}
        className='flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm'
      >
        <div>
          <p className='text-base font-semibold text-slate-900'>{time}</p>
          <div className='mt-1 flex items-center gap-2 text-sm text-slate-600'>
            <span className='flex items-center gap-1'>
              {inPerson && (
                <MapPinIcon className='h-3 w-3 text-secondary-foreground' />
              )}
              {virtual && (
                <VideoCameraIcon className='h-3 w-3 text-secondary-foreground' />
              )}
            </span>
            <span>
              {inPerson && virtual
                ? 'In-person or virtual'
                : inPerson
                  ? 'In-person'
                  : virtual
                    ? 'Virtual'
                    : slot.eventType}
            </span>
          </div>
          <p className='mt-1 text-xs text-slate-500'>
            {slot.duration} mins
            {slot.facility ? ` • ${slot.facility}` : ''}
          </p>
          {slot.facility && (
            <p className='mt-0.5 text-xs text-slate-500'>
              Location: {slot.facility}
            </p>
          )}
        </div>
        <Button
          variant={isSelected ? 'secondary' : 'outline'}
          size='sm'
          onClick={() => onSlotSelect(slot)}
          flashOnClick
          className='mt-2'
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </li>
    );
  };

  if (loading) {
    return (
      <section className='space-y-4'>
        <h2 className='text-lg font-semibold text-slate-900'>
          Upcoming availability
        </h2>
        <div className='rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500'>
          Loading availability…
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='space-y-4'>
        <h2 className='text-lg font-semibold text-slate-900'>
          Upcoming availability
        </h2>
        <div className='rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800'>
          {error}
        </div>
      </section>
    );
  }

  if (filteredSlots.length === 0) {
    return (
      <section className='space-y-4'>
        <h2 className='text-lg font-semibold text-slate-900'>
          Upcoming availability
        </h2>
        <div className='rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-600'>
          No open slots at the moment. Please check back soon.
        </div>
      </section>
    );
  }

  return (
    <section className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-lg font-semibold text-slate-900'>
          Upcoming availability
        </h2>
        {locationOptions.length > 1 && (
          <div className='flex items-center gap-2 text-xs text-slate-600'>
            <span className='font-medium'>Location</span>
            <Select
              value={locationFilter}
              onValueChange={onLocationFilterChange}
            >
              <SelectTrigger className='h-8 w-40 text-xs'>
                <SelectValue placeholder='All locations' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All locations</SelectItem>
                {locationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className='space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='text-sm text-slate-700'>
            {selectedDate
              ? `Showing times for ${format(selectedDate, 'EEEE, MMM d')}`
              : 'Select a date to see available times.'}
          </div>
        </div>

        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={setSelectedDate}
          fromMonth={startOfToday()}
          defaultMonth={defaultMonth}
          disabled={(date: Date) => date < startOfToday()}
          modifiers={{ hasSlots: daysWithSlots }}
          modifiersClassNames={{
            // Only custom modifiers - selected/today/disabled use Calendar defaults
            hasSlots: 'font-semibold text-emerald-700'
          }}
          components={{
            DayButton: (props) => (
              <SlotDayButton {...props} daySlotMap={daySlotMap} />
            )
          }}
          numberOfMonths={1}
        />

        <div className='mt-2'>
          {slotsForSelectedDate.length === 0 ? (
            <p className='text-sm text-slate-600'>
              No open slots for this day. Try another date.
            </p>
          ) : (
            <ul className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'>
              {slotsForSelectedDate.map(renderSlot)}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export { getSlotModes };
