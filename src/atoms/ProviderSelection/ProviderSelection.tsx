import { FC } from 'react';
import clsx from 'clsx';

import { ProviderCard } from './ProviderCard';
import { usePreferences } from '@/PreferencesProvider';
import { ProviderFilter } from './ProviderFilter';
import { useSolApi } from '@/SolApiProvider';
import { FetchingProvidersError } from '../Errors/FetchingProvidersError';
import { isNil } from 'lodash-es';

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
    provider: { setId: setProviderId },
    providers: { fetch: fetchProviders }
  } = useSolApi();
  const { providers, loading, preferences } = usePreferences();
  const providersLabel = providers.length === 1 ? 'provider' : 'providers';

  const selectProvider = (id: string) => {
    setProviderId(id);
    onSelectProvider(id);
  };

  const ProvidersComponent = (): JSX.Element => {
    return (
      <>
        <h2 className={clsx('sol-text-slate-800 sol-text-2xl sol-font-semibold sol-mb-4')}>
          We found{' '}
          <span className='sol-text-primary'>
            {providers.length} {providersLabel}
          </span>{' '}
          for you
        </h2>
        <div className='sol-flex sol-flex-col sol-gap-4'>
          {providers.map((provider) => (
            <ProviderCard
              deliveryMethod={preferences.deliveryMethod}
              key={provider.id}
              provider={provider}
              onSelect={selectProvider}
              text={text}
            />
          ))}
        </div>
      </>
    );
  };

  const LoadingComponent = (): JSX.Element => {
    return (
      <div className='sol-h-full sol-w-full sol-flex sol-items-center sol-justify-center '>
        <span className='loading loading-infinity loading-lg sol-text-primary'></span>
      </div>
    );
  };

  return (
    <div>
      <ProviderFilter />
      {loading ? (
        <LoadingComponent />
      ) : isNil(providers) ? (
        <FetchingProvidersError refetchFn={() => fetchProviders(preferences)} />
      ) : (
        <ProvidersComponent />
      )}
    </div>
  );
};
