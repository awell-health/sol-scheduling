import { FC, useMemo } from 'react';
import { Slots, WeekCalendar } from '../../atoms';
import { DEFAULT_PROFILE_IMAGE } from '../../lib/constants';
import { isSameDay } from 'date-fns';
import { type SlotType } from '../../lib/api';
import clsx from 'clsx';

export type SchedulerProps = {
  provider: {
    name: string;
    profileImageUrl?: string;
  };
  timeZone: string;
  date?: Date;
  slot?: SlotType;
  availabilities: SlotType[];
  loadingAvailabilities?: boolean;
  onDateSelect: (date?: Date) => void;
  onSlotSelect: (slot: SlotType) => void;
  onBooking: (slot: SlotType) => void;
  opts?: {
    allowSchedulingInThePast?: boolean;
  };
  text?: {
    title?: string;
    selectSlot?: string;
    button?: string;
  };
};

export const Scheduler: FC<SchedulerProps> = ({
  date,
  slot,
  timeZone,
  provider,
  availabilities,
  loadingAvailabilities,
  onDateSelect,
  onSlotSelect,
  onBooking,
  opts,
  text
}) => {
  const {
    title = 'Schedule an appointment with',
    selectSlot = 'Select a time slot',
    button = 'Confirm booking'
  } = text || {};

  const { allowSchedulingInThePast = false } = opts || {};

  const filteredSlots = useMemo(() => {
    return availabilities.filter((availableSlot) =>
      date ? isSameDay(availableSlot.slotstart, date) : false
    );
  }, [availabilities, date]);

  return (
    <div>
      <div className='flex justify-between align-center pb-6 mb-5 border-b-1 border-slate-200'>
        <h4 className='font-semibold text-xl m-0 text-slate-800'>
          {title}
          <br />
          <span className='text-primary'>{provider.name}</span>
        </h4>
        <div className='avatar'>
          <div className='w-24 rounded-full'>
            <img
              alt={provider.name}
              src={provider.profileImageUrl ?? DEFAULT_PROFILE_IMAGE}
            />
          </div>
        </div>
      </div>
      <div>
        <WeekCalendar
          value={date}
          onSelect={onDateSelect}
          loading={loadingAvailabilities}
          availabilities={availabilities}
          allowSchedulingInThePast={allowSchedulingInThePast}
        />
      </div>
      {date && (
        <div className='pt-6 mt-6 border-t-1 border-slate-200'>
          <div className='mb-4'>
            <h3 className='font-semibold text-xl m-0 text-slate-800 text-center'>
              {selectSlot}
            </h3>
            <p className='text-center mt-1'>Times in {timeZone}</p>
          </div>
          <Slots
            value={slot}
            onSelect={onSlotSelect}
            slots={filteredSlots}
            timeZone={timeZone}
          />
        </div>
      )}
      {date && slot && (
        <div className='py-6 mt-6 border-t-1 border-slate-200'>
          <button
            className={clsx('btn btn-primary w-full')}
            onClick={() => onBooking(slot)}
          >
            {button}
          </button>
        </div>
      )}
    </div>
  );
};
