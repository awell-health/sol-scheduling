import { BookingError, ProviderSelection } from '../atoms';
import { FC, useMemo, useState } from 'react';
import { Scheduler } from '../molecules';
import { SelectedSlot } from '@/lib/api/schema/shared.schema';
import { type SalesforcePreferencesType } from '@/lib/utils/preferences';

interface SchedulingWizardProps {
  shouldSkipProviderSelection: boolean;
  onCompleteActivity: (
    slot: SelectedSlot,
    preferences: SalesforcePreferencesType
  ) => void;
}

interface Stage {
  id: string;
  isComplete: boolean;
}

export const SchedulingWizard: FC<SchedulingWizardProps> = ({
  shouldSkipProviderSelection
}) => {
  const backLanguage = 'Back to providers';
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
  const initialStage = initialStages.find(
    (stage) => !stage.isComplete
  ) as Stage;
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [currentStage, setCurrentStage] = useState<Stage>(initialStage);

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
      setCurrentStage(nextStage);
    }
  };

  const advanceTo = (id: string) => () => {
    const nextStage = stages.find((stage) => stage.id === id);
    if (nextStage) {
      setCurrentStage(nextStage);
    }
  };

  const resetStages = () => {
    setStages(initialStages);
    setCurrentStage(initialStage);
  };

  const shouldShowBackButton = useMemo(() => {
    return currentStage.id !== 'provider-selection';
  }, [currentStage.id]);

  return (
    <>
      {shouldShowBackButton && (
        <a
          className='link link-primary mb-4 text-sm no-underline hover:underline'
          onClick={resetStages}
          type='button'
        >
          &lt; {backLanguage}
        </a>
      )}
      {currentStage.id === 'provider-selection' && (
        <ProviderSelection
          onSelectProvider={completeStage('provider-selection')}
        />
      )}
      {currentStage.id === 'scheduling' && (
        <Scheduler onBookingError={advanceTo('booking-error')} />
      )}
      {currentStage.id === 'booking-error' && <BookingError />}
    </>
  );
};
