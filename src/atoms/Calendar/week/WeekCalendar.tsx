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
  preferredLocation?: string;
  loading?: boolean;
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
  preferredLocation = 'Telehealth',
  loading
}) => {
  const [currentWeek, setCurrentWeek] = useState(week);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [filteredAvailabilities, setFilteredAvailabilities] = useState<
    SlotType[]
  >([]);

  useEffect(() => {
    handleSelectLocation(preferredLocation);
  }, [availabilities]);

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
    [availabilities, preferredLocation]
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
  const isPreviousWeekDisabled =
    differenceInDays(currentWeek, new Date()) <= -7;

  // Calculate if we should disable the next week button
  const isNextWeekDisabled = differenceInDays(currentWeek, new Date()) >= 30;

  return (
    <div className={'relative'}>
      {loading && (
        <div className='absolute w-full h-full top-0 left-0 flex items-center justify-center bg-opacity-70 bg-white'>
          <span className='loading loading-infinity loading-lg text-primary'></span>
        </div>
      )}
      <p className='text-sm text-gray-800'>
        Select clinic location for in-person visits or telehealth for virtual
        visits
      </p>
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
  return (
    <ul className='menu menu-horizontal rounded-box gap-2 pl-0'>
      {options.map((option) => (
        <li key={option}>
          <button
            className={clsx(
              'btn btn-sm hover:bg-secondary hover:border-1 hover:border-primary',
              {
                'text-slate-800 border-1 border-slate-200  bg-white':
                  option !== selected,
                'border-1 border-primary ring-4 ring-secondary text-primary':
                  option === selected
              }
            )}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        </li>
      ))}
    </ul>
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
      className={clsx('btn', {
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
