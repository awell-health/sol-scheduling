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
        'flex flex-1 md:flex-col justify-between md:justify-center align-center p-3',
        'font-bold text-lg text-center rounded-md',
        'w-full md:w-auto',
        {
          'border-slate-200 border-1 bg-white': !day.isSelected,
          'border-1 border-primary ring-4 ring-secondary': day.isSelected,
          'bg-slate-100 cursor-not-allowed text-slate-300 border-1 border-slate-200':
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
        <div className='font-medium'>{format(day.date, 'EEE')}</div>
        <div>{day.date.getDate()}</div>
        <div>{format(day.date, 'MMM')}</div>
      </time>
      <div
        className={clsx('self-center flex', {
          'text-slate-400': true
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
    <div className='flex mt-2 gap-2 md:gap-0 md:flex-col flex-row'>
      <div
        className={clsx(
          'rounded-full text-sm text-white font-medium my-2 self-center px-4 py-1 w-[85px]',
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
