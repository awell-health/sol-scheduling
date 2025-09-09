import { FC, useState, useMemo, useCallback, useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import { min } from 'lodash-es';
import clsx from 'clsx';
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
import { type SlotType } from '../../../lib/api';
import { DayCard } from './atoms/DayCard';
import { NavigationButton } from './NavigationButton';

export interface Props {
  value: Date | null;
  availabilities: SlotType[];
  onDateSelect: (date: Date | null) => void;
  week?: Date;
  weekStartsOn?: 'sunday' | 'monday';
  hideWeekends?: boolean;
  allowSchedulingInThePast?: boolean;
  loading?: boolean;
}

export const WeekCalendar: FC<Props> = (props) => {
  const {
    value,
    availabilities,
    onDateSelect,
    week = new Date(),
    weekStartsOn = 'monday',
    hideWeekends = true,
    allowSchedulingInThePast = false,
    loading
  } = props;

  const [currentWeek, setCurrentWeek] = useState(week);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);

  useEffect(() => {
    if (availabilities.length > 0) {
      const firstAvailableSlot = min(
        availabilities.map((slot) => slot.slotstart)
      ) as Date;

      const firstAvailableWeekStart = startOfWeek(firstAvailableSlot, {
        weekStartsOn: weekStartsOn === 'sunday' ? 0 : 1
      });

      setCurrentWeek(firstAvailableWeekStart);
    }
  }, [availabilities, weekStartsOn]);

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeek((prevWeek) => subWeeks(prevWeek, 1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeek((prevWeek) => addWeeks(prevWeek, 1));
  }, []);

  const handleDateClick = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      onDateSelect(date);
    },
    [onDateSelect]
  );

  const isAvailable = useCallback(
    (date: Date) => {
      return availabilities.some((availableSlot) =>
        isSameDay(date, availableSlot.slotstart)
      );
    },
    [availabilities]
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
      return availabilities.filter((slot) => isSameDay(slot.slotstart, date))
        .length;
    },
    [availabilities]
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
    availabilities,
    allowSchedulingInThePast
  ]);

  // Calculate if we should disable the previous week button
  const isPreviousWeekDisabled = differenceInDays(currentWeek, new Date()) <= 0;

  // Calculate if we should disable the next week button
  const isNextWeekDisabled = differenceInDays(currentWeek, new Date()) >= 30;
  return (
    <div className='sol-relative'>
      {loading && (
        <div className='sol-absolute sol-w-full sol-h-full sol-top-0 sol-left-0 sol-flex sol-items-center sol-justify-center sol-bg-opacity-70 sol-bg-white'>
          <span className='sol-loading sol-loading-infinity sol-loading-lg sol-text-primary'></span>
        </div>
      )}
      <div className='sol-flex sol-justify-between sol-align-center sol-mb-4 sol-items-center'>
        <div className='sol-text-lg sol-font-medium'>
          {`${format(currentWeek, 'MMMM yyyy')}`}
        </div>
        <div className='sol-flex sol-align-center sol-text-center sol-gap-2'>
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
          'sol-flex sol-gap-2 lg:sol-gap-3 sol-flex-col md:sol-flex-row sol-overflow-x-auto'
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
