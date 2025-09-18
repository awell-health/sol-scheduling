import { FC, useState, useMemo, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { format, isToday, isSameDay, isBefore } from 'date-fns';
import { type SlotType } from '../../../lib/api';
import { DayCard } from './atoms/DayCard';
import { NavigationButton } from './NavigationButton';

export interface Props {
  value: Date | null;
  availabilities: SlotType[];
  onDateSelect: (date: Date | null) => void;
  allowSchedulingInThePast?: boolean;
  loading?: boolean;
}

export const WeekCalendar: FC<Props> = (props) => {
  const {
    value,
    availabilities,
    onDateSelect,
    allowSchedulingInThePast = false,
    loading
  } = props;

  const daysToShow = 5;
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);

  const availableDates = useMemo(() => {
    const uniqueDates = Array.from(
      new Set(
        availabilities.map((slot) => format(slot.slotstart, 'yyyy-MM-dd'))
      )
    )
      .map((dateStr) => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime())
      .filter((day) => !isDisabled(day) && countAvailabilities(day) > 0);

    return uniqueDates;
  }, [availabilities]);

  useEffect(() => {
    setCurrentStartIndex(0);
    onDateSelect(null);
  }, [availabilities]);

  const handlePrevious = useCallback(() => {
    setCurrentStartIndex((prevIndex) => prevIndex - daysToShow);
    onDateSelect(null);
    setSelectedDate(null);
  }, [daysToShow]);

  const handleNext = useCallback(() => {
    setCurrentStartIndex((prevIndex) => prevIndex + daysToShow);
    onDateSelect(null);
    setSelectedDate(null);
  }, [daysToShow]);

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
    const generatedDays = availableDates
      .slice(currentStartIndex, currentStartIndex + daysToShow)
      .map((date) => ({
        date,
        isToday: isToday(date),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        isDisabled: isDisabled(date),
        isAvailable: isAvailable(date),
        shortDayName: format(date, 'EEE'),
        availabilitiesCount: countAvailabilities(date)
      }));
    return generatedDays;
  }, [
    availableDates,
    currentStartIndex,
    daysToShow,
    selectedDate,
    isDisabled,
    isAvailable,
    countAvailabilities
  ]);

  // Click first available date on enter for the first time
  useEffect(() => {
    if (selectedDate === null && days.length > 0) {
      const firstAvailableDay = days.find((day) => day.isAvailable);
      if (firstAvailableDay) {
        handleDateClick(firstAvailableDay.date);
      }
    }
  }, [days, selectedDate, handleDateClick]);

  // Calculate if we should disable the previous navigation button
  const isPreviousDisabled = currentStartIndex === 0;

  // Calculate if we should disable the next navigation button
  const isNextDisabled =
    currentStartIndex + daysToShow >= availableDates.length;
  return (
    <div className='sol-relative'>
      {loading && (
        <div className='sol-absolute sol-w-full sol-h-full sol-top-0 sol-left-0 sol-flex sol-items-center sol-justify-center sol-bg-opacity-70 sol-bg-white'>
          <span className='sol-loading sol-loading-infinity sol-loading-lg sol-text-primary'></span>
        </div>
      )}
      <div className='sol-flex sol-justify-between sol-align-center sol-mb-4 sol-items-center'>
        <div className='sol-text-lg sol-font-medium'>
          {availableDates.length > 0 &&
            `${format(availableDates[currentStartIndex], 'MMMM yyyy')}`}
        </div>
        <div className='sol-flex sol-align-center sol-text-center sol-gap-2'>
          <NavigationButton
            direction='left'
            onClick={handlePrevious}
            isDisabled={isPreviousDisabled}
          />
          <NavigationButton
            direction='right'
            onClick={handleNext}
            isDisabled={isNextDisabled}
          />
        </div>
      </div>
      <div
        className={clsx(
          'sol-grid sol-gap-2 sol-grid-cols-5 md:sol-gap-1'
          // 'sol-flex sol-gap-2 sol-flex-row sol-overflow-x-auto'
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
