import { FC, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { cloneDeep, isEmpty, isNil } from 'lodash-es';
import { Slots, WeekCalendar } from '@/atoms';
import { usePreferences } from '@/PreferencesProvider';
import { useSolApi } from '@/SolApiProvider';
import { ProviderAvatar } from '@/atoms/ProviderAvatar';
import {
  LocationType,
  EventDeliveryMethod,
  type SlotType,
  type SlotWithConfirmedLocation
} from '@/lib/api';
import { filterByDate } from '@/lib/utils/availabilities';
import videoChatIcon from '@/assets/video-chat-icon.svg';

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

  const { setSelectedSlot, bookingInformation } = usePreferences();
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
      data: fetchedAvailabilities,
      loading,
      fetch: fetchAvailabilities
    },
    booking: { book: bookAppointment, isBooking }
  } = useSolApi();
  const [availabilities, setAvailabilities] = useState<SlotType[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<SlotType | null>(null);

  /**
   * Transforms availabilities to include virtual options for in-person slots.
   * - Virtual slots remain as-is
   * - In-Person slots are duplicated: one remains In-Person, one becomes Virtual
   *   Moreover, both slots share the same eventId (with '_virtual' suffix for virtual)
   */
  const transformAvailabilities = (slots: SlotType[]): SlotType[] => {
    const transformedSlots: SlotType[] = [];

    slots.forEach((slot) => {
      transformedSlots.push(slot);
      if (slot.location === EventDeliveryMethod.InPerson) {
        const virtualSlot = cloneDeep(slot);
        virtualSlot.eventId = `${virtualSlot.eventId}_virtual`;
        virtualSlot.location = EventDeliveryMethod.Telehealth;
        transformedSlots.push(virtualSlot);
      }
    });

    return transformedSlots;
  };

  useEffect(() => {
    const transformedAvailabilities = transformAvailabilities(
      fetchedAvailabilities
    );
    const sortedAvailabilities = cloneDeep(transformedAvailabilities).sort(
      (a, b) => a.slotstart.getTime() - b.slotstart.getTime()
    );
    setAvailabilities(sortedAvailabilities);
  }, [fetchedAvailabilities]);

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
      return sameDaySlots;
    }
  }, [availabilities, date, loading, bookingInformation]);

  const handleDateSelect = (date: Date | null) => {
    setDate(date);
    setSlot(null);
  };

  const selectTimeRef = useRef<HTMLDivElement>(null);
  const bookingButtonRef = useRef<HTMLDivElement>(null);

  const scrollToTime = () => {
    if (selectTimeRef.current) {
      selectTimeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  const scrollToBookingButton = () => {
    if (bookingButtonRef.current) {
      bookingButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    if (slot) {
      scrollToBookingButton();
    }
  }, [slot]);

  useEffect(() => {
    scrollToTime();
  }, [date]);

  const handleSlotSelect = (slot: SlotType) => {
    setSlot(slot);
    setSelectedSlot(slot);
  };

  const handleBooking = (slot: SlotType) => {
    const originalEventId = slot.eventId.endsWith('_virtual')
      ? slot.eventId.replace('_virtual', '')
      : slot.eventId;

    const confirmedLocation =
      slot.location === EventDeliveryMethod.Telehealth
        ? LocationType.Telehealth
        : LocationType.InPerson;

    const slotWithDeliveryMethod = {
      ...slot,
      eventId: originalEventId,
      confirmedLocation
    } satisfies SlotWithConfirmedLocation;

    void bookAppointment(
      slotWithDeliveryMethod,
      bookingInformation.preferences,
      onBookingError
    );
  };

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
            <div className='sol-skeleton sol-h-6 sol-w-48 sol-bg-secondary' />
          ) : (
            <span className='sol-text-primary'>{providerName}</span>
          )}
        </h4>
        <div className='sol-order-last'>
          <ProviderAvatar
            name={providerName}
            image={provider?.image}
            classes='sol-w-20 sol-h-20 sm:sol-w-32 sm:sol-h-32'
            loading={loadingProvider}
          />
        </div>
      </div>
      <div>
        <WeekCalendar
          value={date}
          availabilities={availabilities}
          onDateSelect={handleDateSelect}
          allowSchedulingInThePast={allowSchedulingInThePast}
        />
      </div>
      {date && (
        <div
          ref={selectTimeRef}
          className='sol-pt-6 sol-mt-6 sol-mb-6 sol-border-t-1 sol-border-slate-200'
        >
          <div className='sol-flex sol-flex-row-reverse sm:sol-flex-col sol-justify-between sm:sol-justify-center sol-gap-2 sol-w-full'>
            <div className='sol-flex sol-flex-row sol-items-normal sm:sol-items-center sol-justify-end sol-gap-1 sol-pb-2'>
              <div>
                <img src={videoChatIcon} alt='Video Chat Icon' />
              </div>
              <div className='sol-text-sm sol-text-slate-500'>
                Virtual Appointment
              </div>
            </div>
            <div className='sol-mb-4 sol-text-left sm:sol-text-center'>
              <h3 className='sol-font-semibold sol-text-xl sol-m-0 sol-text-slate-800'>
                {selectSlot}
              </h3>
              <p className='sol-mt-1'>
                Times in {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </p>
            </div>
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
          ref={bookingButtonRef}
          className='sol-py-6 sol-mt-6 sol-border-t-1 sol-border-slate-200'
        >
          <button
            className={clsx('sol-btn sol-w-full', {
              'sol-btn-secondary sol-cursor-not-allowed': isBooking,
              'sol-btn-primary': !isBooking
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
