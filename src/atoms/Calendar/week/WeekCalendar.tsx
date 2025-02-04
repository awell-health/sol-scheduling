import { FC, useState, useMemo, useCallback, useEffect } from 'react';
import { uniq } from 'lodash-es';
import { differenceInDays } from 'date-fns';
import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameDay,
  isBefore
} from 'date-fns';
import {
  DeliveryMethod,
  DeliveryMethodType,
  LocationType,
  type LocationTypeType,
  type SlotType
} from '../../../lib/api';
import { DayCard } from './atoms/DayCard';
import { filterByLocation } from '@/lib/utils/availabilities';

export interface WeekCalendarProps {
  value: Date | null;
  availabilities: SlotType[];
  onLocationSelect: ({
    confirmedLocation,
    facility
  }: {
    confirmedLocation: LocationTypeType;
    facility?: string;
  }) => void;
  onDateSelect: (date: Date | null) => void;
  week?: Date;
  weekStartsOn?: 'sunday' | 'monday';
  hideWeekends?: boolean;
  allowSchedulingInThePast?: boolean;
  loading?: boolean;
  deliveryMethodPreference?: DeliveryMethodType;
}

export const WeekCalendar: FC<WeekCalendarProps> = ({
  value,
  availabilities,
  onLocationSelect,
  onDateSelect,
  week = new Date(),
  weekStartsOn = 'monday',
  hideWeekends = true,
  allowSchedulingInThePast = false,
  loading,
  deliveryMethodPreference = DeliveryMethod.Telehealth
}) => {
  const [currentWeek, setCurrentWeek] = useState(week);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [filteredAvailabilities, setFilteredAvailabilities] = useState<
    SlotType[]
  >([]);

  /**
   * On the initial render, select the preferred location based on the delivery method preference:
   * - If the preference is Telehealth, select Telehealth.
   * - If the preference is InPerson, select the first available facility.
   */
  useEffect(() => {
    const preferredLocation =
      deliveryMethodPreference === DeliveryMethod.Telehealth
        ? 'Telehealth'
        : availabilities[0]?.facility || 'Telehealth';

    setSelectedLocation(preferredLocation);
    onLocationSelect({
      confirmedLocation:
        preferredLocation === 'Telehealth'
          ? LocationType.Telehealth
          : LocationType.InPerson,
      facility:
        preferredLocation === 'Telehealth' ? undefined : preferredLocation
    });

    const _filtered = filterByLocation({
      availabilities,
      location: {
        confirmedLocation:
          preferredLocation === 'Telehealth'
            ? LocationType.Telehealth
            : LocationType.InPerson,
        facility:
          preferredLocation === 'Telehealth' ? undefined : preferredLocation
      }
    });
    setFilteredAvailabilities(_filtered);
  }, [availabilities, deliveryMethodPreference]);

  useEffect(() => {
    if (availabilities.length > 0) {
      const firstAvailableSlot = availabilities.reduce((earliest, slot) =>
        earliest && earliest.slotstart < slot.slotstart ? earliest : slot
      );

      const firstAvailableWeekStart = startOfWeek(
        firstAvailableSlot.slotstart,
        {
          weekStartsOn: weekStartsOn === 'sunday' ? 0 : 1
        }
      );

      setCurrentWeek(firstAvailableWeekStart);
    }
  }, [availabilities, weekStartsOn]);

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeek((prevWeek) => subWeeks(prevWeek, 1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeek((prevWeek) => addWeeks(prevWeek, 1));
  }, []);

  const handleSelectLocation = useCallback(
    (location: string) => {
      const confirmedLocation =
        location === 'Telehealth'
          ? LocationType.Telehealth
          : LocationType.InPerson;

      const _location = {
        confirmedLocation,
        facility: location === 'Telehealth' ? undefined : location
      };

      setSelectedLocation(location);
      onLocationSelect(_location);

      setSelectedDate(null);
      onDateSelect(null);

      const _filtered = filterByLocation({
        availabilities,
        location: _location
      });
      setFilteredAvailabilities(_filtered);
    },
    [availabilities]
  );

  // Get unique facilities from availabilities
  const availableFacilities = useMemo(() => {
    // Extract the 'facility' field from each slot
    const uniqueFacilities = uniq(
      availabilities.map((slot) => {
        return slot.facility ? slot.facility : 'Telehealth';
      })
    );
    // Add 'Telehealth' if it's not already in the array
    if (!uniqueFacilities.includes('Telehealth')) {
      uniqueFacilities.push('Telehealth');
    }

    return uniqueFacilities;
  }, [availabilities]);

  const handleDateClick = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      onDateSelect(date);
    },
    [onDateSelect]
  );

  const isAvailable = useCallback(
    (date: Date) => {
      return filteredAvailabilities.some((availableSlot) =>
        isSameDay(date, availableSlot.slotstart)
      );
    },
    [filteredAvailabilities]
  );

  const isDisabled = useCallback(
    (date: Date) => {
      const dateIsInThePast = isBefore(date, new Date()) && !isToday(date);

      if (dateIsInThePast && !allowSchedulingInThePast) return true;

      return false;
    },
    [allowSchedulingInThePast]
  );

  const countAvailabilities = useCallback(
    (date: Date) => {
      return filteredAvailabilities.filter((slot) =>
        isSameDay(slot.slotstart, date)
      ).length;
    },
    [filteredAvailabilities]
  );

  const days = useMemo(() => {
    const weekStartsOnIndex = weekStartsOn === 'sunday' ? 0 : 1;
    const start = startOfWeek(currentWeek, { weekStartsOn: weekStartsOnIndex });
    const end = endOfWeek(currentWeek, { weekStartsOn: weekStartsOnIndex });

    let generatedDays = eachDayOfInterval({ start, end }).map((date) => ({
      date,
      isToday: isToday(date),
      isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      isDisabled: isDisabled(date),
      isAvailable: isAvailable(date),
      shortDayName: format(date, 'EEE'),
      availabilitiesCount: countAvailabilities(date)
    }));

    if (hideWeekends) {
      generatedDays = generatedDays.filter(
        (day) =>
          format(day.date, 'EEE') !== 'Sat' && format(day.date, 'EEE') !== 'Sun'
      );
    }

    return generatedDays;
  }, [
    currentWeek,
    selectedDate,
    hideWeekends,
    weekStartsOn,
    selectedLocation,
    filteredAvailabilities,
    allowSchedulingInThePast
  ]);

  // Calculate if we should disable the previous week button
  const isPreviousWeekDisabled = differenceInDays(currentWeek, new Date()) <= 0;

  // Calculate if we should disable the next week button
  const isNextWeekDisabled = differenceInDays(currentWeek, new Date()) >= 30;

  return (
    <div className='relative'>
      {loading && (
        <div className='absolute w-full h-full top-0 left-0 flex items-center justify-center bg-opacity-70 bg-white'>
          <span className='loading loading-infinity loading-lg text-primary'></span>
        </div>
      )}
      <LocationFilter
        options={availableFacilities}
        selected={selectedLocation}
        onSelect={handleSelectLocation}
      />
      <div className='flex justify-between align-center mb-4 items-center'>
        <div className='text-lg font-medium'>
          {`${format(currentWeek, 'MMMM yyyy')}`}
        </div>
        <div className='flex align-center text-center gap-2'>
          <NavigationButton
            direction='left'
            onClick={handlePreviousWeek}
            isDisabled={isPreviousWeekDisabled}
          />
          <NavigationButton
            direction='right'
            onClick={handleNextWeek}
            isDisabled={isNextWeekDisabled}
          />
        </div>
      </div>
      <div
        className={clsx(
          'flex gap-2 lg:gap-3 flex-col md:flex-row overflow-x-auto'
        )}
      >
        {days.map((day) => (
          <DayCard
            key={day.date.toString()}
            day={day}
            onSelect={handleDateClick}
          />
        ))}
      </div>
    </div>
  );
};

const LocationFilter: FC<{
  options: Array<string>;
  selected: string;
  onSelect: (location: string) => void;
}> = ({ options, selected, onSelect }) => {
  const hasTelehealth = options.includes('Telehealth');
  const inPersonOptions = options.filter((opt) => opt !== 'Telehealth');
  const hasInPerson = inPersonOptions.length > 0;

  return (
    <div className='flex flex-col gap-2 mb-4'>
      <div className='flex items-center gap-4'>
        {/* In-person section */}
        {hasInPerson && (
          <div className='flex flex-col gap-2 items-center self-start sm:self-auto'>
            <p className='text-sm font-medium text-slate-500'>In Person</p>
            <div className='flex flex-col sm:flex-row sm:gap-2 gap-1'>
              {inPersonOptions.map((option) => (
                <button
                  key={option}
                  className={clsx(
                    'btn btn-sm hover:bg-secondary hover:border-1 hover:border-primary',
                    {
                      'text-slate-800 border-1 border-slate-200 bg-white':
                        option !== selected,
                      'border-1 border-primary ring-4 ring-secondary text-primary selected':
                        option === selected
                    }
                  )}
                  onClick={() => onSelect(option)}
                >
                  {option.slice(5)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Divider when both types are present */}
        {hasInPerson && hasTelehealth && (
          <div className='sm:h-16 h-20 w-px bg-slate-300' />
        )}

        {/* Telehealth section */}
        {hasTelehealth && (
          <div className='flex flex-col gap-2 items-center self-start sm:self-auto'>
            <p className='text-sm font-medium text-slate-500'>Virtual</p>
            <button
              className={clsx(
                'btn btn-sm hover:bg-secondary hover:border-1 hover:border-primary',
                {
                  'text-slate-800 border-1 border-slate-200 bg-white':
                    'Telehealth' !== selected,
                  'border-1 border-primary ring-4 ring-secondary text-primary selected':
                    'Telehealth' === selected
                }
              )}
              onClick={() => onSelect('Telehealth')}
            >
              Telehealth
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NavigationButton: FC<{
  direction: 'left' | 'right';
  onClick: () => void;
  isDisabled: boolean;
}> = ({ direction, onClick, isDisabled }) => {
  const chevronClasses = clsx(
    'flex flex-none align-center justify-center',
    'text-primary size-8 font-bold'
  );

  return (
    <button
      onClick={onClick}
      className={clsx('btn sm:px-6 sm:py-2 px-3 py-1', {
        'btn-disabled opacity-50 cursor-not-allowed': isDisabled,
        'btn-secondary': !isDisabled
      })}
      disabled={isDisabled}
      aria-label={
        direction === 'left' ? 'Go to previous week' : 'Go to next week'
      }
    >
      {direction === 'left' ? (
        <ChevronLeftIcon className={chevronClasses} aria-hidden='true' />
      ) : (
        <ChevronRightIcon className={chevronClasses} aria-hidden='true' />
      )}
    </button>
  );
};
