import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  CircularSpinner,
  HostedPageFooter,
  Button
} from '@awell-health/ui-library';
import { BookingConfirmation, ProviderSelection } from '../atoms';
import { Scheduler } from '../molecules';
import classes from './SchedulingActivity.module.scss';
import {
  BookAppointmentResponseType,
  GetAvailabilitiesResponseType,
  GetProvidersResponseType
} from '../lib/api';
import { type SlotType } from '../lib/api';

interface SchedulingActivityProps {
  timeZone: string;
  onProviderSelect: (id: string) => void;
  onDateSelect: (date: Date) => void;
  onSlotSelect: (slot: SlotType) => void;
  onBooking: (slot: SlotType) => Promise<BookAppointmentResponseType>;
  fetchProviders: () => Promise<GetProvidersResponseType>;
  fetchAvailability: (
    providerId: string
  ) => Promise<GetAvailabilitiesResponseType>;
  onCompleteActivity: () => void;
  text?: {
    selectProvider?: {
      button?: string;
    };
    selectSlot?: {
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
  const { completeActivity: { nextButton = 'Next' } = {} } = text || {};

  const { allowSchedulingInThePast = false } = opts || {};

  const [providers, setProviders] = useState<GetProvidersResponseType['data']>(
    []
  );
  const [availabilities, setAvailabilities] = useState<
    GetAvailabilitiesResponseType['data'] | undefined
  >(undefined);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingAvailabilities, setLoadingAvailabilities] = useState(false);
  const [loadingConfirmation, setLoadingConfirmation] = useState(false);

  const [selectedProviderId, setSelectedProviderId] = useState<
    string | undefined
  >(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<SlotType | undefined>(
    undefined
  );
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    fetchProviders().then((providers) => {
      setProviders(providers.data);
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

  const handleBooking = useCallback(
    (slot: SlotType) => {
      setLoadingConfirmation(true);
      setSelectedSlot(slot);

      onBooking(slot).then(() => {
        setBookingConfirmed(true);
        setLoadingConfirmation(false);
      });
    },
    [onBooking]
  );

  const providerAvailabilities = useMemo(() => {
    if (selectedProviderId === undefined) return [];

    const availabilitiesForProvider = availabilities?.[selectedProviderId];

    if (!availabilitiesForProvider) return [];

    return availabilitiesForProvider.map((availability) => ({
      eventId: availability.eventId,
      slotstart: new Date(availability.slotstart),
      duration: availability.duration,
      providerId: availability.providerId
    }));
  }, [selectedProviderId, availabilities]);

  const selectedProvider = useMemo(() => {
    return providers.find((provider) => provider.Id === selectedProviderId);
  }, [providers, selectedProviderId]);

  return (
    <>
      <main id='ahp_main_content_with_scroll_hint' className={classes.main}>
        <div className={classes.container}>
          {selectedProvider === undefined && (
            <>
              {loadingProviders ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularSpinner size='sm' />
                </div>
              ) : (
                <ProviderSelection
                  onSelect={handleProviderSelect}
                  providers={providers.map((provider) => ({
                    id: provider.Id,
                    name: provider.name,
                    language: provider.language,
                    gender: provider.gender,
                    ethnicity: provider.ethnicity
                  }))}
                  text={{ button: text?.selectProvider?.button }}
                />
              )}
            </>
          )}

          {selectedProvider !== undefined && bookingConfirmed !== true && (
            <>
              {loadingAvailabilities || loadingConfirmation ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularSpinner size='sm' />
                </div>
              ) : (
                <div>
                  <Scheduler
                    provider={{
                      name: selectedProvider?.name ?? 'No name'
                    }}
                    timeZone={timeZone}
                    availabilities={providerAvailabilities}
                    date={selectedDate}
                    slot={selectedSlot}
                    onDateSelect={handleDateSelect}
                    onSlotSelect={handleSlotSelect}
                    onBooking={handleBooking}
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

          {bookingConfirmed && selectedSlot && (
            <div>
              <BookingConfirmation
                providerName={selectedProvider?.name ?? 'No name'}
                slot={selectedSlot}
                text={{
                  bookingConfirmed: text?.bookingConfirmation?.bookingConfirmed
                }}
              />
            </div>
          )}
        </div>
      </main>
      {bookingConfirmed && selectedSlot && (
        <HostedPageFooter>
          <div className={`${classes.button_wrapper} ${classes.container}`}>
            <Button variant='primary' onClick={onCompleteActivity}>
              {nextButton}
            </Button>
          </div>
        </HostedPageFooter>
      )}
    </>
  );
};
