import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
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
import { CircularSpinner, Button } from '@awell-health/ui-library';
import { GetAvailabilitiesResponseType } from 'lib/api';

export type AvailabilityType = Pick<
  GetAvailabilitiesResponseType['data'][0],
  'startDate' | 'eventId' | 'duration'
>;
export interface WeekCalendarProps {
  value?: Date;
  onSelect: (date: Date) => void;
  week?: Date;
  availabilities?: AvailabilityType[];
  loading?: boolean;
  weekStartsOn?: 'sunday' | 'monday';
  hideWeekends?: boolean;
}

const Slot: FC<{ count: number }> = ({ count }) => {
  const slotText = count === 1 ? 'slot' : 'slots';
  const colorClass = count === 0 ? 'none' : count === 1 ? 'orange' : 'green';

  return (
    <div className={`${classes.slot} ${classes[colorClass]}`}>
      {count === 0 ? '-' : `${count} ${slotText}`}
    </div>
  );
};

export const WeekCalendar: FC<WeekCalendarProps> = ({
  value,
  onSelect,
  week = new Date(),
  availabilities = [],
  loading,
  weekStartsOn = 'sunday',
  hideWeekends = true
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
        isSameDay(date, availableSlot.startDate)
      );
    },
    [availabilities]
  );

  const isDisabled = useCallback((date: Date) => {
    return isBefore(date, new Date()) && !isToday(date);
  }, []);

  const countavailabilities = useCallback(
    (date: Date) => {
      return availabilities.filter((slot) => isSameDay(slot.startDate, date))
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

  return (
    <div className={classes.calendarContainer}>
      {loading && (
        <div className={classes.loadingOverlay}>
          <CircularSpinner size='sm' />
        </div>
      )}
      <div className={classes.calendarHeader}>
        <div className={classes.activeWeek}>
          {`${format(currentWeek, 'MMMM yyyy')}`}
        </div>
        <div className={classes.calendarNavigation}>
          <Button onClick={handlePreviousWeek} variant='tertiary' type='button'>
            <span className={classes.srOnly}>Previous week</span>
            <ChevronLeftIcon className={classes.navIcon} aria-hidden='true' />
          </Button>
          <Button onClick={handleNextWeek} variant='tertiary' type='button'>
            <span className={classes.srOnly}>Next week</span>
            <ChevronRightIcon className={classes.navIcon} aria-hidden='true' />
          </Button>
        </div>
      </div>
      <div className={classes.calendarBody}>
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
              classes.defaultDayStyle,
              day.isSelected && classes.dayIsSelected
            )}
          >
            <time dateTime={day.date.toISOString()}>
              <div className={classes.dayName}>{day.shortDayName}</div>
              <div className={classes.dayNumber}>{day.date.getDate()}</div>
              <div className={classes.month}>{format(day.date, 'MMM')}</div>
            </time>
            <div className={classes.availabilities}>
              <Slot count={!day.isAvailable ? 0 : day.availabilitiesCount} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
