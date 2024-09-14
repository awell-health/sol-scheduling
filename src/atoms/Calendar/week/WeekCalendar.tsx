import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { FC, useState, useMemo, useCallback } from 'react';
import classes from './WeekCalendar.module.scss';
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

export interface WeekCalendarProps {
  value?: Date;
  onSelect: (date: Date) => void;
  week?: Date;
  availabilities?: SlotType[];
  loading?: boolean;
  weekStartsOn?: 'sunday' | 'monday';
  hideWeekends?: boolean;
  allowSchedulingInThePast?: boolean;
}

export const WeekCalendar: FC<WeekCalendarProps> = ({
  value,
  onSelect,
  week = new Date(),
  availabilities = [],
  loading,
  weekStartsOn = 'sunday',
  hideWeekends = true,
  allowSchedulingInThePast = false
}) => {
  const [currentWeek, setCurrentWeek] = useState(week);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeek((prevWeek) => subWeeks(prevWeek, 1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeek((prevWeek) => addWeeks(prevWeek, 1));
  }, []);

  const handleDateClick = useCallback(
    (date: Date) => {
      if (!isDisabled(date)) {
        setSelectedDate(date);
        onSelect(date);
      }
    },
    [onSelect]
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

  const countavailabilities = useCallback(
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
      availabilitiesCount: countavailabilities(date)
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
    isDisabled,
    isAvailable,
    countavailabilities,
    weekStartsOn
  ]);

  const chevronClasses = clsx(
    'bg-none cursor-pointer b-0 m-1.5 p-1.5',
    'flex flex-none align-center justify-center',
    'text-slate-50 size-8 font-bold hover:bg-blend-darken'
  );

  return (
    <div className={'relative'}>
      {loading && (
        <div className='absolute w-full h-full top-0 left-0 flex items-center justify-center bg-opacity-70 bg-white'>
          <span className='loading loading-spinner loading-lg text-primary'></span>
        </div>
      )}
      <div className='flex justify-between align-center mb-4 items-center'>
        <div className='text-lg font-medium'>
          {`${format(currentWeek, 'MMMM yyyy')}`}
        </div>
        <div className='flex align-center text-center gap-2'>
          <button onClick={handlePreviousWeek} className='btn btn-primary'>
            <span className='hidden'>Previous week</span>
            <ChevronLeftIcon className={chevronClasses} aria-hidden='true' />
          </button>
          <button
            onClick={handleNextWeek}
            className='btn btn-primary'
            type='button'
          >
            <span className='hidden'>Next week</span>
            <ChevronRightIcon className={chevronClasses} aria-hidden='true' />
          </button>
        </div>
      </div>
      <div className={clsx('flex cursor-pointer gap-4')}>
        {days.map((day) => (
          <button
            key={day.date.toString()}
            type='button'
            onClick={() => handleDateClick(day.date)}
            disabled={
              day.isDisabled ||
              !day.isAvailable ||
              day.availabilitiesCount === 0
            }
            className={clsx(
              'flex flex-1 flex-col justify-center align-center p-4',
              'font-bold text-lg text-center rounded-md',
              {
                'border-slate-200 bg-white': !day.isSelected && !day.isDisabled,
                'border-1 border-primary ring-4 ring-secondary': day.isSelected
              },
              {
                'bg-slate-100 cursor-not-allowed text-slate-300 border-2 border-slate-200':
                  day.isDisabled,
                'hover:ring-primary hover:ring-1 hover:z-10': !day.isDisabled
              }
            )}
          >
            <time
              dateTime={day.date.toISOString()}
              className={clsx('self-center', {
                'text-slate-400': day.isDisabled || !day.isAvailable,
                'text-primary': !day.isDisabled
              })}
            >
              <div className='font-medium'>{day.shortDayName}</div>
              <div>{day.date.getDate()}</div>
              <div>{format(day.date, 'MMM')}</div>
            </time>
            <div
              className={clsx('self-center', {
                'text-slate-400': true
              })}
            >
              <Slot
                count={
                  !day.isAvailable || day.isDisabled
                    ? 0
                    : day.availabilitiesCount
                }
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const Slot: FC<{ count: number }> = ({ count }) => {
  const slotText = count === 1 ? 'slot' : 'slots';
  const colorClass = count === 0 ? 'none' : count === 1 ? 'orange' : 'green';

  return (
    <div className={`${classes.slot} ${classes[colorClass]}`}>
      {count === 0 ? '-' : `${count} ${slotText}`}
    </div>
  );
};
