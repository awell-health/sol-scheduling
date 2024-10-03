import { FC } from 'react';
import clsx from 'clsx';

import { ProviderCard } from './ProviderCard';
import { usePreferences } from '@/PreferencesProvider';
import { ProviderFilter } from './ProviderFilter';
import { useSolApi } from '@/SolApiProvider';
import { FetchingProvidersError } from '../FetchingProvidersError';

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
  const {
    provider: { setId: setProviderId }
  } = useSolApi();
  const { providers, loading, fetchProvidersError } = usePreferences();
  const providersLabel = providers.length === 1 ? 'provider' : 'providers';

  const selectProvider = (id: string) => {
    setProviderId(id);
    onSelectProvider(id);
  };

  if (loading) {
    return (
      <div className='h-full w-full flex items-center justify-center '>
        <span className='loading loading-infinity loading-lg text-primary'></span>
      </div>
    );
  }

  if (fetchProvidersError) {
    return <FetchingProvidersError />;
  }

  return (
    <div>
      <ProviderFilter />
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
    </div>
  );
};
