import { FC, useState } from 'react';
import {} from 'daisyui';
import { upperFirst } from 'lodash-es';
import clsx from 'clsx';
import ISO6391 from 'iso-639-1';

import { DEFAULT_PROFILE_IMAGE } from '../../lib/constants';
import { toFullNameState, toFullNameGender } from '../../lib/utils';
import type { Provider } from './ProviderSelection';

export type ProviderProps = {
  provider: Provider;
  onSelect: (id: string) => void;
  text?: {
    button?: string;
  };
};

export const ProviderCard: FC<ProviderProps> = ({
  provider,
  onSelect,
  text
}) => {
  const { button = 'Book appointment' } = text || {};
  const locations = provider.location.state
    .map((location: string) => toFullNameState(location))
    .join(', ');

  return (
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
              <ListItem
                label='Gender'
                value={toFullNameGender(provider.gender)}
              />
            )}
            {provider.language && (
              <ListItem
                label='Language'
                value={ISO6391.getName(provider.language)}
              />
            )}
            {provider.ethnicity && (
              <ListItem label='Ethnicity' value={provider.ethnicity} />
            )}
            {provider.clinicalFocus && (
              <ListItem
                label='Clinical focus'
                value={provider.clinicalFocus
                  .map((_f) => upperFirst(_f))
                  .join(', ')}
              />
            )}
            {provider.location?.state.length > 0 && (
              <ListItem
                label='Clinic location(s)'
                value={`Sees patients in person in ${locations}`}
              />
            )}
            {provider.bio && <BioListItem label='Bio' value={provider.bio} />}
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
  );
};

const ListItem: FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <li className='flex-1 basis-1/2'>
      <span className='font-semibold text-primary'>{label}: </span>
      <span>{value}</span>
    </li>
  );
};

interface BioProps {
  label: string;
  value: string;
}

const BioListItem: FC<BioProps> = ({ label, value }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleBio = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li className='flex-1 basis-full'>
      <span className='font-semibold text-primary'>{label}: </span>
      {isExpanded ? (
        <>
          <span>{value}</span>
          <button onClick={toggleBio} className='text-blue-500 ml-2'>
            Hide
          </button>
        </>
      ) : (
        <>
          <span>{value.substring(0, 100)}...</span>
          <button onClick={toggleBio} className='text-blue-500 ml-2'>
            Show more
          </button>
        </>
      )}
    </li>
  );
};
