import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { CircularSpinner } from '@awell-health/ui-library';
import { ProviderSelection } from '../atoms';
import { Scheduler } from '../molecules';
import classes from './SchedulingActivity.module.scss';
import {
  BookAppointmentResponseType,
  GetAvailabilitiesResponseType,
  GetProvidersResponseType
} from '../lib/api';
import { type SlotType } from '../lib/api';
import { isEmpty } from 'lodash';

const ONE_WEEK_IN_MS = 1000 * 60 * 60 * 24 * 7;

interface SchedulingActivityProps {
  timeZone: string;
  providerId?: string;
  onProviderSelect: (id: string) => void;
  onDateSelect: (date: Date) => void;
  onSlotSelect: (slot: SlotType) => void;
  onBooking: (slot: SlotType) => Promise<BookAppointmentResponseType>;
  fetchProviders: () => Promise<GetProvidersResponseType>;
  fetchAvailability: (
    providerId: string
  ) => Promise<GetAvailabilitiesResponseType>;
  onCompleteActivity: (slot: SlotType) => void;
  text?: {
    selectProvider?: {
      button?: string;
    };
    selectSlot?: {
      backToProviders?: string;
      title?: string;
      selectSlot?: string;
      button?: string;
    };
    bookingConfirmation?: {
      bookingConfirmed?: string;
    };
    completeActivity?: {
      nextButton?: string;
    };
  };
  opts?: {
    allowSchedulingInThePast?: boolean;
  };
}

export const SchedulingActivity: FC<SchedulingActivityProps> = ({
  providerId: prefilledProviderId,
  timeZone,
  onProviderSelect,
  onDateSelect,
  onSlotSelect,
  onBooking,
  fetchProviders,
  fetchAvailability,
  onCompleteActivity,
  text,
  opts
}) => {
  const { selectSlot: { backToProviders = 'Back to providers' } = {} } =
    text || {};

  const { allowSchedulingInThePast = false } = opts || {};

  const [providers, setProviders] = useState<GetProvidersResponseType['data']>(
    []
  );
  const [availabilities, setAvailabilities] = useState<
    GetAvailabilitiesResponseType['data'] | undefined
  >(undefined);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingAvailabilities, setLoadingAvailabilities] = useState(false);
  const [loadingConfirmation, setLoadingConfirmation] = useState(false);

  const [selectedProviderId, setSelectedProviderId] = useState<
    string | undefined
  >(prefilledProviderId);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<SlotType | undefined>(
    undefined
  );
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    if (selectedProviderId && !isEmpty(selectedProviderId)) {
      setLoadingAvailabilities(true);
      fetchAvailability(selectedProviderId).then((availabilities) => {
        setAvailabilities(availabilities.data);
        setLoadingAvailabilities(false);
      });
      return;
    }

    setLoadingProviders(true);

    void fetchProviders().then(async (providers) => {
      const providersWithSlots = await Promise.all(
        providers.data.map(async (p) => {
          const avail = await fetchAvailability(p.id);
          const slots = avail['data'][p.id].filter(
            (s) =>
              new Date(s.slotstart).valueOf() <
              new Date().valueOf() + ONE_WEEK_IN_MS
          ).length;
          return { ...p, numberOfSlotsAvailable: slots };
        })
      );
      setProviders(
        providersWithSlots.sort(
          (a, b) =>
            (b.numberOfSlotsAvailable ?? 0) - (a.numberOfSlotsAvailable ?? 0)
        )
      );
      setLoadingProviders(false);
    });
  }, []);

  const handleProviderSelect = useCallback(
    (id: string) => {
      setSelectedProviderId(id);
      onProviderSelect(id);
      setAvailabilities(undefined); // Reset availabilities
      setLoadingAvailabilities(true);

      fetchAvailability(id).then((availabilities) => {
        setAvailabilities(availabilities.data);
        setLoadingAvailabilities(false);
      });
    },
    [onProviderSelect]
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setSelectedSlot(undefined); // Reset slot
      onDateSelect(date);
    },
    [onDateSelect]
  );

  const handleSlotSelect = useCallback(
    (slot: SlotType) => {
      setSelectedSlot(slot);
      onSlotSelect(slot);
    },
    [onSlotSelect]
  );

  // TODO: why are we setting the selected slot here?
  const handleBooking = useCallback(
    (slot: SlotType) => {
      setLoadingConfirmation(true);
      setSelectedSlot(slot);

      onBooking(slot).then(() => {
        setBookingConfirmed(true);
        setLoadingConfirmation(false);

        onCompleteActivity(slot);
      });
    },
    [onBooking]
  );

  const providerAvailabilities = useMemo(() => {
    if (selectedProviderId === undefined) return [];

    const availabilitiesForProvider = availabilities?.[selectedProviderId];

    if (!availabilitiesForProvider) return [];
    console.log('provider availabilities', availabilitiesForProvider);

    return availabilitiesForProvider.map((availability) => ({
      eventId: availability.eventId,
      slotstart: new Date(availability.slotstart),
      duration: availability.duration,
      providerId: availability.providerId
    }));
  }, [selectedProviderId, availabilities]);

  const selectedProvider = useMemo(() => {
    return providers.find((provider) => provider.id === selectedProviderId);
  }, [providers, selectedProviderId]);

  const handleBackNavigation = useCallback(() => {
    setAvailabilities(undefined);
    setSelectedDate(undefined);
    setSelectedSlot(undefined);
    setSelectedProviderId(undefined);
  }, []);

  return (
    <>
      <main id='ahp_main_content_with_scroll_hint' className={classes.main}>
        <div className={classes.container}>
          {(selectedProviderId === undefined ||
            isEmpty(selectedProviderId)) && (
            <>
              {loadingProviders ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularSpinner size='sm' />
                </div>
              ) : (
                <ProviderSelection
                  onSelect={handleProviderSelect}
                  providers={providers}
                  text={{ button: text?.selectProvider?.button }}
                />
              )}
            </>
          )}

          {selectedProviderId !== undefined &&
            !isEmpty(selectedProviderId) &&
            bookingConfirmed !== true && (
              <>
                {loadingAvailabilities || loadingConfirmation ? (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularSpinner size='sm' />
                  </div>
                ) : (
                  <div>
                    {isEmpty(prefilledProviderId) && (
                      <button
                        className={classes.back_button}
                        onClick={handleBackNavigation}
                        type='button'
                      >
                        &lt; {backToProviders}
                      </button>
                    )}
                    <Scheduler
                      provider={{
                        name:
                          selectedProvider?.name ??
                          `Provider ${selectedProviderId} (missing endpoint to fetch provider info)`
                      }}
                      timeZone={timeZone}
                      availabilities={providerAvailabilities}
                      date={selectedDate}
                      slot={selectedSlot}
                      onDateSelect={handleDateSelect}
                      onSlotSelect={handleSlotSelect}
                      onBooking={handleBooking}
                      loadingAvailabilities={loadingAvailabilities}
                      text={{
                        title: text?.selectSlot?.title,
                        selectSlot: text?.selectSlot?.selectSlot,
                        button: text?.selectSlot?.button
                      }}
                      opts={{ allowSchedulingInThePast }}
                    />
                  </div>
                )}
              </>
            )}
        </div>
      </main>
    </>
  );
};
