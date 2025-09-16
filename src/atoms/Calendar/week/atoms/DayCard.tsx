import clsx from 'clsx';
import { FC, useCallback, useEffect, useRef } from 'react';
import { format } from 'date-fns';

interface Day {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  availabilitiesCount: number;
}

export interface DayCardProps {
  onSelect: (date: Date) => void;
  day: Day;
}

export const DayCard: FC<DayCardProps> = ({ onSelect, day }) => {
  const cannotActivate = useCallback(
    (day: Day) => {
      return day.isDisabled || day.availabilitiesCount === 0;
    },
    [day]
  );

  const slotRef = useRef<HTMLDivElement>(null);

  const scrollToSlot = () => {
    if (slotRef.current) {
      slotRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  useEffect(() => {
    if (day.isSelected) {
      scrollToSlot();
    }
  }, [day.isSelected]);

  return (
    <button
      key={day.date.toString()}
      type='button'
      data-testid={day.date.toDateString()}
      onClick={() => onSelect(day.date)}
      disabled={cannotActivate(day)}
      className={clsx(
        'sol-flex sol-flex-1 sol-flex-col sol-justify-between sol-justify-center sol-align-center sol-p-3',
        'sol-font-bold sol-text-lg sol-text-center sol-rounded-md',
        'sol-w-full sol-w-auto',
        {
          'sol-border-slate-200 sol-border-1 sol-bg-white': !day.isSelected,
          'sol-border-1 sol-border-primary sol-ring-4 sol-ring-secondary':
            day.isSelected,
          'sol-bg-slate-100 sol-cursor-not-allowed sol-text-slate-300 sol-border-1 sol-border-slate-200':
            day.isDisabled,
          'hover:sol-z-10 hover:sol-bg-secondary hover:sol-border-primary sol-cursor-pointer':
            !cannotActivate(day)
        }
      )}
    >
      <time
        dateTime={day.date.toISOString()}
        className={clsx(
          'sol-flex sol-flex-col sol-flex-none sol-block sol-gap-1 sol-self-center sol-text-sm sm:sol-text-lg',
          {
            'sol-text-slate-400': cannotActivate(day),
            'sol-text-slate-800': !cannotActivate(day) && !day.isSelected
          }
        )}
      >
        <div>{format(day.date, 'EEE')}</div>
        <div className='sol-text-lg'>{day.date.getDate()}</div>
        <div>{format(day.date, 'MMM')}</div>
      </time>
      <div
        className={clsx('sol-self-center sol-flex', {
          'sol-text-slate-400': true
        })}
        ref={slotRef}
      >
        <NumberOfSlots count={day.isDisabled ? 0 : day.availabilitiesCount} />
      </div>
    </button>
  );
};

const NumberOfSlots: FC<{ count: number }> = ({ count }) => {
  const slotText = count === 1 ? 'slot' : 'slots';
  return (
    <div className='sol-flex sol-mt-2 sol-gap-2 sol-gap-0 sol-flex-col sol-flex-row'>
      <div
        className={clsx(
          'sol-rounded-full sol-text-sm sol-text-white sol-font-medium sol-my-2 sol-self-center sol-px-4 sol-py-1 sol-w-[50px] sm:sol-w-[85px]',

          {
            'sol-bg-slate-300': count === 0,
            'sol-bg-yellow-500': count > 0 && count <= 2,
            'sol-bg-green-600': count > 2
          }
        )}
        aria-hidden='true'
      >
        {count === 0 ? 'No slots' : `${count}`}
        <span className='sm:sol-inline sol-hidden'> {slotText}</span>
      </div>
    </div>
  );
};
