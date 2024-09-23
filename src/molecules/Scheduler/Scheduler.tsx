import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { isSameDay } from 'date-fns';
import clsx from 'clsx';
import { isEmpty, isNil } from 'lodash-es';
import { Slots, WeekCalendar } from '@/atoms';
import { usePreferences } from '@/PreferencesProvider';
import { useSolApi } from '@/SolApiProvider';
import { ProviderAvatar } from '@/atoms/ProviderAvatar';
import { SelectedSlot } from '@/lib/api/schema/shared.schema';

export type SchedulerProps = {
  onBookingError: () => void;
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
  onBookingError,
  opts,
  text
}) => {
  const {
    title = 'Schedule an appointment with',
    selectSlot = 'Select a time slot',
    button = 'Confirm booking'
  } = text || {};

  const { allowSchedulingInThePast = false } = opts || {};

  const { selectedProvider, setSelectedSlot, bookingInformation } =
    usePreferences();
  const {
    availabilities: { data, loading, fetch: fetchAvailabilities },
    bookAppointment,
    isBooking
  } = useSolApi();

  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<SelectedSlot | null>(null);

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

  const bookingButtonRef = useRef<HTMLDivElement>(null);

  const scrollToSlot = () => {
    if (bookingButtonRef.current) {
      bookingButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  useEffect(() => {
    scrollToSlot();
  }, [slot]);

  const handleSlotSelect = (slot: SelectedSlot) => {
    setSlot(slot);
    setSelectedSlot(slot);
  };

  const handleBooking = (slot: SelectedSlot) => {
    void bookAppointment(slot, bookingInformation.preferences, onBookingError);
  };

  if (!selectedProvider) {
    return null;
  }

  return (
    <div>
      <div className='flex justify-between items-center pb-6 mb-5 border-b-1 border-slate-200'>
        <h4 className='font-semibold text-xl m-0 text-slate-800'>
          {title}
          <br />
          <span className='text-primary'>{selectedProvider.name}</span>
        </h4>
        <ProviderAvatar
          name={selectedProvider.name}
          image={selectedProvider.image}
          classes='w-24'
        />
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
        <div
          className='py-6 mt-6 border-t-1 border-slate-200'
          ref={bookingButtonRef}
        >
          <button
            className={clsx('btn w-full', {
              'btn-secondary cursor-not-allowed': isBooking,
              'btn-primary': !isBooking
            })}
            onClick={() => handleBooking(slot)}
            disabled={isBooking}
          >
            {isBooking ? (
              <span className='loading loading-infinity loading-md text-primary'></span>
            ) : (
              button
            )}
          </button>
        </div>
      )}
    </div>
  );
};
