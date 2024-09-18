import { FC, useEffect, useMemo, useState } from 'react';
import { isSameDay } from 'date-fns';
import clsx from 'clsx';
import { isEmpty, isNil } from 'lodash-es';
import { Slots, WeekCalendar } from '@/atoms';
import { DEFAULT_PROFILE_IMAGE } from '@/lib/constants';
import { type SlotType } from '@/lib/api';
import { usePreferences } from '@/PreferencesProvider';
import { useSolApi } from '@/SolApiProvider';

export type SchedulerProps = {
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

export const Scheduler: FC<SchedulerProps> = ({ onBooking, opts, text }) => {
  const {
    title = 'Schedule an appointment with',
    selectSlot = 'Select a time slot',
    button = 'Confirm booking'
  } = text || {};

  const { allowSchedulingInThePast = false } = opts || {};

  const { selectedProvider, setSelectedSlot } = usePreferences();
  const {
    availabilities: { data, loading, fetch: fetchAvailabilities }
  } = useSolApi();

  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<SlotType | null>(null);

  useEffect(() => {
    if (!selectedProvider) {
      return;
    }
    fetchAvailabilities(selectedProvider.id);
  }, [selectedProvider]);

  const filteredSlots = useMemo(() => {
    if (loading || isNil(data) || isEmpty(data)) {
      return [];
    } else {
      return data.filter((availableSlot) =>
        date ? isSameDay(availableSlot.slotstart, date) : false
      );
    }
  }, [data, date, loading]);

  const handleDateSelect = (date: Date | null) => {
    setDate(date);
    setSlot(null);
  };

  const handleSlotSelect = (slot: SlotType) => {
    setSlot(slot);
    setSelectedSlot(slot);
  };

  if (!selectedProvider) {
    return null;
  }

  return (
    <div>
      <div className='flex justify-between align-center pb-6 mb-5 border-b-1 border-slate-200'>
        <h4 className='font-semibold text-xl m-0 text-slate-800'>
          {title}
          <br />
          <span className='text-primary'>{selectedProvider.name}</span>
        </h4>
        <div className='avatar'>
          <div className='w-24 rounded-full'>
            <img
              alt={selectedProvider.name}
              src={selectedProvider.image ?? DEFAULT_PROFILE_IMAGE}
            />
          </div>
        </div>
      </div>
      <div>
        <WeekCalendar
          value={date}
          onSelect={handleDateSelect}
          allowSchedulingInThePast={allowSchedulingInThePast}
        />
      </div>
      {date && (
        <div className='pt-6 mt-6 border-t-1 border-slate-200'>
          <div className='mb-4'>
            <h3 className='font-semibold text-xl m-0 text-slate-800 text-center'>
              {selectSlot}
            </h3>
            <p className='text-center mt-1'>
              Times in {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
          </div>
          <Slots
            value={slot}
            onSelect={handleSlotSelect}
            slots={filteredSlots}
            timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
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
