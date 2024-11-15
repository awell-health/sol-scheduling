import { FC, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { isEmpty, isNil } from 'lodash-es';
import { Slots, WeekCalendar } from '@/atoms';
import { usePreferences } from '@/PreferencesProvider';
import { useSolApi } from '@/SolApiProvider';
import { ProviderAvatar } from '@/atoms/ProviderAvatar';
import {
  LocationType,
  type SlotType,
  type SlotWithConfirmedLocation
} from '@/lib/api';
import { filterByDate, filterByLocation } from '@/lib/utils/availabilities';

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

  const { setSelectedSlot, bookingInformation, setLocation, preferences } =
    usePreferences();
  const {
    provider: { getId: provivderId }
  } = useSolApi();

  const {
    provider: {
      fetch: fetchProvider,
      data: provider,
      loading: loadingProvider
    },
    availabilities: {
      data: availabilities,
      loading,
      fetch: fetchAvailabilities
    },
    booking: { book: bookAppointment, isBooking }
  } = useSolApi();

  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<SlotType | null>(null);

  useEffect(() => {
    if (provivderId === null) {
      return;
    }

    fetchProvider(provivderId);
    fetchAvailabilities(provivderId);
  }, [provivderId]);

  const filteredSlots = useMemo(() => {
    if (loading || isNil(availabilities) || isEmpty(availabilities)) {
      return [];
    } else {
      const sameDaySlots = filterByDate({ availabilities, date });
      const slotsThatMatchLocation = filterByLocation({
        availabilities: sameDaySlots,
        location: bookingInformation?.location
      });

      return slotsThatMatchLocation;
    }
  }, [availabilities, date, loading, bookingInformation]);

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

  const handleSlotSelect = (slot: SlotType) => {
    setSlot(slot);
    setSelectedSlot(slot);
  };

  const handleBooking = (slot: SlotType) => {
    const slotWithDeliveryMethod = {
      ...slot,
      confirmedLocation:
        bookingInformation?.location?.confirmedLocation ??
        LocationType.Telehealth
    } satisfies SlotWithConfirmedLocation;

    void bookAppointment(
      slotWithDeliveryMethod,
      bookingInformation.preferences,
      onBookingError
    );
  };

  const selectedDeliveryMethodPreferences = useMemo(() => {
    return preferences.deliveryMethod;
  }, [preferences]);

  if (provivderId === null) {
    return <div>No provider selected.</div>;
  }
  const providerName = isNil(provider)
    ? 'Unknown'
    : `${provider?.firstName} ${provider?.lastName}`;
  return (
    <div>
      <div className='flex justify-between items-center pb-6 mb-5 border-b-1 border-slate-200'>
        <h4 className='font-semibold text-xl m-0 text-slate-800'>
          {title}
          <br />

          {loadingProvider ? (
            <div className='skeleton h-6 w-48 bg-secondary' />
          ) : (
            <span className='text-primary'>{providerName}</span>
          )}
        </h4>
        <ProviderAvatar
          name={providerName}
          image={provider?.image}
          classes='w-24 h-24'
          loading={loadingProvider}
        />
      </div>
      <div>
        <WeekCalendar
          value={date}
          availabilities={availabilities}
          onDateSelect={handleDateSelect}
          onLocationSelect={setLocation}
          deliveryMethodPreference={selectedDeliveryMethodPreferences}
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
