import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  HostedPageLayout,
  useTheme,
  CircularSpinner,
  HostedPageFooter,
  Button
} from '@awell-health/ui-library';
import {
  mockProviderAvailabilityResponse,
  mockProvidersResponse
} from '../__mocks__';
import { BookingConfirmation, ProviderSelection } from '../atoms';
import { Scheduler } from '../molecules';
import classes from './Preview.module.scss';

interface PreviewProps {
  onProviderSelect: (id: string) => void;
  onDateSelect: (date: Date) => void;
  onSlotSelect: (date: Date) => void;
  onBooking: (date: Date) => void;
  onCompleteActivity: () => void;
}

const mockFetchProviders = (): Promise<typeof mockProvidersResponse> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(mockProvidersResponse), 750)
  );

const mockFetchAvailability = (): Promise<
  typeof mockProviderAvailabilityResponse
> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(mockProviderAvailabilityResponse), 750)
  );

const mockBookAppointment = () =>
  new Promise((resolve) => setTimeout(() => resolve(true), 1500));

export const Preview: FC<PreviewProps> = ({
  onProviderSelect,
  onDateSelect,
  onSlotSelect,
  onBooking,
  onCompleteActivity
}) => {
  const { updateLayoutMode, resetLayoutMode } = useTheme();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [providers, setProviders] = useState<typeof mockProvidersResponse>([]);
  const [availabilities, setAvailabilities] = useState<
    typeof mockProviderAvailabilityResponse | undefined
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

    mockFetchProviders().then((providers) => {
      setProviders(providers);
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

      mockFetchAvailability().then((availabilities) => {
        setAvailabilities(availabilities);
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
      onBooking(date);

      mockBookAppointment().then(() => {
        setBookingConfirmed(true);
        setLoadingConfirmation(false);
      });
    },
    [onBooking]
  );

  const providerAvailabilities = useMemo(() => {
    if (selectedProviderId === undefined) return [];

    //@ts-expect-error fix later
    const availabilitiesForProvider = availabilities?.[selectedProviderId];

    if (!availabilitiesForProvider) return [];

    return availabilitiesForProvider.flatMap(
      //@ts-expect-error fix later
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
