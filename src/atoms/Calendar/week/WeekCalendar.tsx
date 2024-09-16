import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { FC, useState, useMemo, useCallback } from 'react';
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
    'flex flex-none align-center justify-center',
    'text-primary size-8 font-bold'
  );

  const cannotActivate = (day: (typeof days)[0]) => {
    return day.isDisabled || !day.isAvailable || day.availabilitiesCount === 0;
  };

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
          <button onClick={handlePreviousWeek} className='btn btn-secondary'>
            <span className='hidden'>Previous week</span>
            <ChevronLeftIcon className={chevronClasses} aria-hidden='true' />
          </button>
          <button
            onClick={handleNextWeek}
            className='btn btn-secondary'
            type='button'
          >
            <span className='hidden'>Next week</span>
            <ChevronRightIcon className={chevronClasses} aria-hidden='true' />
          </button>
        </div>
      </div>
      <div className={clsx('flex gap-2 lg:gap-4 flex-col md:flex-row')}>
        {days.map((day) => (
          <button
            key={day.date.toString()}
            type='button'
            onClick={() => handleDateClick(day.date)}
            disabled={cannotActivate(day)}
            className={clsx(
              'flex flex-1 md:flex-col justify-between md:justify-center align-center p-4',
              'font-bold text-lg text-center rounded-md',
              {
                'border-slate-200 border-1 bg-white': !day.isSelected,
                'border-1 border-primary ring-4 ring-secondary': day.isSelected,
                'bg-slate-100 cursor-not-allowed text-slate-300 border-2 border-slate-200':
                  day.isDisabled,
                'hover:z-10 hover:bg-secondary hover:border-primary cursor-pointer':
                  !cannotActivate(day)
              }
            )}
          >
            <time
              dateTime={day.date.toISOString()}
              className={clsx(
                'flex flex-row md:flex-none md:block gap-1 md:self-center',
                {
                  'text-slate-400': cannotActivate(day),
                  'text-slate-800': !cannotActivate(day) && !day.isSelected,
                  'text-primary': day.isSelected
                }
              )}
            >
              <div className='font-medium'>{day.shortDayName}</div>
              <div>{day.date.getDate()}</div>
              <div>{format(day.date, 'MMM')}</div>
            </time>
            <div
              className={clsx('self-center flex', {
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
  return (
    <div className='flex mt-2 gap-2 md:gap-0 md:flex-col flex-row'>
      <div
        className={clsx(
          'rounded-full text-sm text-white font-medium my-2 self-center px-4 py-1 w-[90px]',
          {
            'bg-slate-300': count === 0,
            'bg-yellow-500': count > 0 && count <= 2,
            'bg-green-600': count > 2
          }
        )}
        aria-hidden='true'
      >
        {count === 0 ? 'No slots' : `${count} ${slotText}`}
      </div>
    </div>
  );
};
