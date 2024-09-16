import { React, FC } from 'react';
import {} from 'daisyui';
import clsx from 'clsx';

import { GetProvidersResponseType } from 'lib/api';
import { ProviderCard } from './ProviderCard';

export type BaseProvider = GetProvidersResponseType['data'][number];
export interface Provider extends BaseProvider {
  profileImageUrl?: string;
}

export type ProviderSelectionProps = {
  providers: Provider[];
  onSelect: (id: string) => void;
  text?: {
    button?: string;
  };
};

export const ProviderSelection: FC<ProviderSelectionProps> = ({
  providers,
  onSelect,
  text
}) => {
  const providersLabel = providers.length === 1 ? 'provider' : 'providers';

  return (
    <div>
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
            onSelect={onSelect}
            text={text}
          />
        ))}
      </div>
    </div>
  );
};
