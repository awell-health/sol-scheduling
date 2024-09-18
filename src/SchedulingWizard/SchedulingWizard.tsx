import { BookingConfirmation, ProviderSelection } from '../atoms';
import { FC, useMemo, useState } from 'react';
import { Scheduler } from '../molecules';
import { GetProvidersInputType, SlotType } from '../lib/api';

interface SchedulingWizardProps {
  shouldSkipProviderSelection: boolean;
  onCompleteActivity: (
    slot: SlotType,
    preferences: GetProvidersInputType
  ) => void;
}

interface Stage {
  id: string;
  isComplete: boolean;
}

export const SchedulingWizard: FC<SchedulingWizardProps> = ({
  shouldSkipProviderSelection,
  onCompleteActivity
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
      id: 'confirmation',
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
    const nextStage = updatedStages.find((stage) => !stage.isComplete);
    setStages(updatedStages);
    if (nextStage) {
      setCurrentStage(nextStage);
    }
  };
  const resetStages = () => {
    setStages(initialStages);
    setCurrentStage(initialStage);
  };

  const shouldShowBackButton = useMemo(() => {
    return (
      currentStage.id !== 'provider-selection' && !shouldSkipProviderSelection
    );
  }, [currentStage.id, shouldSkipProviderSelection]);

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
        <Scheduler onBooking={completeStage('scheduling')} />
      )}
      {currentStage.id === 'confirmation' && (
        <BookingConfirmation onCompleteActivity={onCompleteActivity} />
      )}
    </>
  );
};
