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
    button = 'Book appointment'
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
      <div className='sol-flex sol-flex-row sol-justify-between sol-items-center sol-gap-2 sol-pb-6 sol-mb-5 sol-border-b-1 sol-border-slate-200'>
        <h4 className='sol-font-semibold sol-text-xl sol-m-0 sol-text-slate-800'>
          {title}
          <br />

          {loadingProvider ? (
            <div className='skeleton sol-h-6 sol-w-48 sol-bg-secondary' />
          ) : (
            <span className='sol-text-primary'>{providerName}</span>
          )}
        </h4>
        <div className='sol-order-last'>
          <ProviderAvatar
            name={providerName}
            image={provider?.image}
            classes='sol-w-28 sol-h-28 sm:sol-w-32 sm:sol-h-32'
            loading={loadingProvider}
          />
        </div>
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
        <div className='sol-pt-6 sol-mt-6 sol-border-t-1 sol-border-slate-200'>
          <div className='sol-mb-4'>
            <h3 className='sol-font-semibold sol-text-xl sol-m-0 sol-text-slate-800 sol-text-center'>
              {selectSlot}
            </h3>
            <p className='sol-text-center sol-mt-1'>
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
          className='sol-py-6 sol-mt-6 sol-border-t-1 sol-border-slate-200'
          ref={bookingButtonRef}
        >
          <button
            className={clsx('btn sol-w-full', {
              'btn-secondary cursor-not-allowed': isBooking,
              'btn-primary': !isBooking
            })}
            onClick={() => handleBooking(slot)}
            disabled={isBooking}
          >
            {isBooking ? (
              <span className='sol-loading sol-loading-infinity sol-loading-md sol-text-primary'></span>
            ) : (
              button
            )}
          </button>
        </div>
      )}
    </div>
  );
};
