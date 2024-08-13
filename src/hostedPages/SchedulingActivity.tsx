import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  HostedPageLayout,
  useTheme,
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
} from 'lib/api';

interface SchedulingActivityProps {
  onProviderSelect: (id: string) => void;
  onDateSelect: (date: Date) => void;
  onSlotSelect: (date: Date) => void;
  onBooking: (date: Date) => Promise<BookAppointmentResponseType>;
  fetchProviders: () => Promise<GetProvidersResponseType>;
  fetchAvailability: () => Promise<GetAvailabilitiesResponseType>;
  onCompleteActivity: () => void;
}

export const SchedulingActivity: FC<SchedulingActivityProps> = ({
  onProviderSelect,
  onDateSelect,
  onSlotSelect,
  onBooking,
  fetchProviders,
  fetchAvailability,
  onCompleteActivity
}) => {
  const { updateLayoutMode, resetLayoutMode } = useTheme();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
  const [selectedSlot, setSelectedSlot] = useState<Date | undefined>(undefined);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    updateLayoutMode('flexible');

    fetchProviders().then((providers) => {
      setProviders(providers.data);
      setLoadingProviders(false);
    });

    return () => {
      // Reset to default mode on unmount
      resetLayoutMode();
    };
  }, []);

  const handleProviderSelect = useCallback(
    (id: string) => {
      setAvailabilities(undefined);
      setLoadingAvailabilities(true);
      setSelectedProviderId(id);
      onProviderSelect(id);

      fetchAvailability().then((availabilities) => {
        setAvailabilities(availabilities.data);
        setLoadingAvailabilities(false);
      });
    },
    [onProviderSelect]
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setSelectedSlot(undefined);
      onDateSelect(date);
    },
    [onDateSelect]
  );

  const handleSlotSelect = useCallback(
    (slot: Date) => {
      setSelectedSlot(slot);
      onSlotSelect(slot);
    },
    [onSlotSelect]
  );

  const handleBooking = useCallback(
    (date: Date) => {
      setLoadingConfirmation(true);
      setSelectedSlot(date);

      onBooking(date).then(() => {
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

    return availabilitiesForProvider.flatMap(
      (availability) => new Date(availability.startDate)
    );
  }, [selectedProviderId, availabilities]);

  const selectedProvider = useMemo(() => {
    return providers.find(
      (provider) => provider.providerId === selectedProviderId
    );
  }, [providers, selectedProviderId]);

  return (
    <HostedPageLayout
      logo={
        'https://res.cloudinary.com/da7x4rzl4/image/upload/v1710884206/Developer%20portal/awell_logo.svg'
      }
      onCloseHostedPage={() => alert('Stop session')}
    >
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
                    id: provider.providerId,
                    name: provider.name,
                    language: provider.language,
                    gender: provider.gender,
                    ethnicity: provider.ethnicity
                  }))}
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
                  />
                </div>
              )}
            </>
          )}

          {bookingConfirmed && selectedSlot && (
            <div>
              <BookingConfirmation
                providerName={selectedProvider?.name ?? 'No name'}
                date={selectedSlot}
              />
            </div>
          )}
        </div>
      </main>
      {bookingConfirmed && selectedSlot && (
        <HostedPageFooter>
          <div className={`${classes.button_wrapper} ${classes.container}`}>
            <Button variant='primary' onClick={onCompleteActivity}>
              Next
            </Button>
          </div>
        </HostedPageFooter>
      )}
    </HostedPageLayout>
  );
};
