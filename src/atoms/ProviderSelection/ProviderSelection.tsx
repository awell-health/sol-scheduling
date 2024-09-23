import { FC } from 'react';
import {} from 'daisyui';
import clsx from 'clsx';

import { ProviderCard } from './ProviderCard';
import { usePreferences } from '@/PreferencesProvider';
import { ProviderFilter } from './ProviderFilter';

export type ProviderSelectionProps = {
  onSelectProvider: (id: string) => void;
  text?: {
    button?: string;
  };
};

export const ProviderSelection: FC<ProviderSelectionProps> = ({
  text,
  onSelectProvider
}) => {
  const { providers, loading, setSelectedProviderId } = usePreferences();
  const providersLabel = providers.length === 1 ? 'provider' : 'providers';
  const selectProvider = (id: string) => {
    setSelectedProviderId(id);
    onSelectProvider(id);
  };
  return (
    <div>
      <ProviderFilter />
      {loading ? (
        <div className='h-full w-full flex items-center justify-center '>
          <span className='loading loading-infinity loading-lg text-primary'></span>
        </div>
      ) : (
        <>
          <h2 className={clsx('text-slate-800 text-2xl font-semibold mb-4')}>
            We found{' '}
            <span className='text-primary'>
              {providers.length} {providersLabel}
            </span>{' '}
            for you
          </h2>
          <div className='flex flex-col gap-4'>
            {providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onSelect={selectProvider}
                text={text}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
