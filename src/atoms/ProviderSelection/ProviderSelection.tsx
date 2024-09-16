import { FC } from 'react';
import { upperFirst } from 'lodash-es';
import { DEFAULT_PROFILE_IMAGE } from '../../lib/constants';
import { GetProvidersResponseType } from 'lib/api';
import { toFullNameState, toFullNameGender } from '../../lib/utils';
import {} from 'daisyui';
import clsx from 'clsx';

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
  const { button = 'Book appointment' } = text || {};

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
          <div key={provider.id} className='rounded-md border-1 bg-white p-4'>
            <div className='flex gap-4 align-center justify-between'>
              <div className='flex gap-4 align-center'>
                <div className='avatar'>
                  <div className='w-16 rounded-full'>
                    <img
                      alt={provider.name}
                      src={provider.profileImageUrl ?? DEFAULT_PROFILE_IMAGE}
                    />
                  </div>
                </div>
                <div className='flex flex-col justify-center'>
                  <h3 className='text-slate-800 text-lg m-0 font-semibold'>
                    {provider.name}
                  </h3>
                  {provider?.location?.state && (
                    <span className='text-slate-600 text-md'>
                      {toFullNameState(provider.location.state)}
                    </span>
                  )}
                </div>
              </div>
              <div className='flex'>
                <div
                  className={clsx('self-center', {
                    'text-primary': provider.events?.length ?? 0 > 0,
                    'text-slate-500': provider.events?.length ?? 0 === 0
                  })}
                >
                  {provider.events?.length} slots available
                </div>
              </div>
            </div>
            <div className={clsx('mt-4 bg-slate-100 rounded-md p-3')}>
              <div>
                <ul className='flex flex-wrap list-none m-0 p-0 gap-y-4 mb-4'>
                  {provider.gender && (
                    <ProvListItem
                      label='Gender'
                      value={toFullNameGender(provider.gender)}
                    />
                  )}
                  {provider.ethnicity && (
                    <ProvListItem
                      label='Ethnicity'
                      value={provider.ethnicity}
                    />
                  )}
                  {provider.clinicalFocus && (
                    <ProvListItem
                      label='Clinical focus'
                      value={provider.clinicalFocus
                        .map((_f) => upperFirst(_f))
                        .join(', ')}
                    />
                  )}
                </ul>
              </div>
              <div>
                <button
                  onClick={() => onSelect(provider.id)}
                  className={clsx('btn btn-primary w-full')}
                >
                  {button}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProvListItem: FC<{ label: string; value: string }> = ({
  label,
  value
}) => {
  return (
    <li className='flex-1 basis-1/2'>
      <span className='font-semibold text-primary'>{label}: </span>
      <span>{value}</span>
    </li>
  );
};
