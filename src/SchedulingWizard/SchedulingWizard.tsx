import { BookingError, ProviderSelection } from '../atoms';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Scheduler } from '../molecules';
import { type SlotWithConfirmedLocation } from '@/lib/api/schema/shared.schema';
import { type SalesforcePreferencesType } from '@/lib/utils/preferences';
import { usePreferences } from '@/PreferencesProvider';
import { isEmpty } from 'lodash-es';
import { useSolApi } from '@/SolApiProvider';

interface SchedulingWizardProps {
  shouldSkipProviderSelection: boolean;
  prefilledProviderId?: string;
  onCompleteActivity: (
    slot: SlotWithConfirmedLocation,
    preferences: SalesforcePreferencesType
  ) => void;
}

interface Stage {
  id: string;
  isComplete: boolean;
}

export const SchedulingWizard: FC<SchedulingWizardProps> = ({
  prefilledProviderId,
  shouldSkipProviderSelection
}) => {
  const backLanguage = shouldSkipProviderSelection
    ? 'Search for other providers'
    : 'Back to providers';

  const initialStages = [
    {
      id: 'provider-selection',
      isComplete: shouldSkipProviderSelection
    },
    {
      id: 'scheduling',
      isComplete: false
    },
    {
      id: 'booking-error',
      isComplete: false
    }
  ];

  const initialStage = initialStages.find((stage) => !stage.isComplete)
    ?.id as string;

  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [currentStageId, setCurrentStageId] = useState(initialStage);
  const { preferences, bookingInformation } = usePreferences();
  const {
    provider: { setId: setProviderId, data: provider },
    providers: { fetch: fetchProviders }
  } = useSolApi();

  useEffect(() => {
    if (prefilledProviderId === undefined || isEmpty(prefilledProviderId))
      return;
    setProviderId(prefilledProviderId);
  }, [shouldSkipProviderSelection]);

  const completeStage = (id: string) => () => {
    const updatedStages = stages.map((stage) => {
      if (stage.id === id) {
        return { ...stage, isComplete: true };
      }
      return stage;
    });
    setStages(updatedStages);
    const nextStage = updatedStages.find((stage) => !stage.isComplete);
    if (nextStage) {
      setCurrentStageId(nextStage.id);
    }
  };

  const advanceTo = (id: string) => () => {
    const nextStage = stages.find((stage) => stage.id === id);
    if (nextStage) {
      setCurrentStageId(nextStage.id);
    }
  };

  const handleBackToProvidersNavigation = useCallback(async () => {
    setStages(
      initialStages.map((_stage) => ({ ..._stage, isComplete: false }))
    );
    setCurrentStageId('provider-selection');
    await fetchProviders(preferences);
  }, [preferences, fetchProviders]);

  const shouldShowBackButton = useMemo(() => {
    return currentStageId !== 'provider-selection';
  }, [currentStageId]);

  return (
    <>
      {shouldShowBackButton && (
        <a
          className='link link-primary sol-mb-4 sol-text-sm sol-no-underline hover:sol-underline'
          onClick={handleBackToProvidersNavigation}
          type='button'
        >
          &lt; {backLanguage}
        </a>
      )}
      {currentStageId === 'provider-selection' && (
        <ProviderSelection
          onSelectProvider={completeStage('provider-selection')}
        />
      )}
      {currentStageId === 'scheduling' && (
        <Scheduler onBookingError={advanceTo('booking-error')} />
      )}
      {currentStageId === 'booking-error' && (
        <BookingError provider={provider} slot={bookingInformation.slot} />
      )}
    </>
  );
};
