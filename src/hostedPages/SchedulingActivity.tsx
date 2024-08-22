import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { CircularSpinner } from '@awell-health/ui-library';
import { ProviderSelection } from '../atoms';
import { Scheduler } from '../molecules';
import classes from './SchedulingActivity.module.scss';
import {
  type GetAvailabilitiesResponseType,
  type GetProvidersResponseType
} from '../lib/api';
import { type SlotType } from '../lib/api';
import { isEmpty } from 'lodash';
import { SchedulingActivityProps } from './types';

const ONE_WEEK_IN_MS = 1000 * 60 * 60 * 24 * 7;

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

  const skipProviderSelectionStage = useMemo(() => {
    if (selectedProviderId && !isEmpty(selectedProviderId)) return true;

    return false;
  }, [selectedProviderId]);

  useEffect(() => {
    if (skipProviderSelectionStage && selectedProviderId) {
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
      onProviderSelect(id);

      setSelectedProviderId(id);
      setAvailabilities(undefined); // Reset availabilities
      setLoadingAvailabilities(true); // Start loading availabilities

      void fetchAvailability(id).then((availabilities) => {
        setAvailabilities(availabilities.data);
        setLoadingAvailabilities(false);
      });
    },
    [onProviderSelect]
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      onDateSelect(date);

      setSelectedDate(date);
      setSelectedSlot(undefined); // Reset slot
    },
    [onDateSelect]
  );

  const handleSlotSelect = useCallback(
    (slot: SlotType) => {
      onSlotSelect(slot);

      setSelectedSlot(slot);
    },
    [onSlotSelect]
  );

  const handleBooking = useCallback(
    (slot: SlotType) => {
      setLoadingConfirmation(true);

      onBooking(slot).then(() => {
        setBookingConfirmed(true);
        setLoadingConfirmation(false);

        onCompleteActivity(slot);
      });
    },
    [onBooking, onCompleteActivity]
  );

  const handleBackNavigation = useCallback(() => {
    const resetToProviderStage = () => {
      setAvailabilities(undefined);
      setSelectedDate(undefined);
      setSelectedSlot(undefined);
      setSelectedProviderId(undefined);
    };

    resetToProviderStage();
  }, []);

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

  const showProviderStage = useMemo(() => {
    if (selectedProviderId === undefined || isEmpty(selectedProviderId))
      return true;

    return false;
  }, [selectedProviderId]);

  const showSlotStage = useMemo(() => {
    if (
      selectedProviderId !== undefined &&
      !isEmpty(selectedProviderId) &&
      bookingConfirmed !== true
    )
      return true;

    return false;
  }, [selectedProviderId, bookingConfirmed]);

  return (
    <>
      <main id='ahp_main_content_with_scroll_hint' className={classes.main}>
        <div className={classes.container}>
          {showProviderStage && (
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

          {showSlotStage && (
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
