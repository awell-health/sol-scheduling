import { FC, useState } from 'react';
import { uniq } from 'lodash-es';
import clsx from 'clsx';

import { toFullNameState, toFullNameGender } from '@/lib/utils';
import type { Provider } from './types';
import { ProviderAvatar } from '../ProviderAvatar';

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

  const location = provider.location?.state ?? '';
  const facilities = uniq((provider?.events ?? []).map((e) => e.facility));
  const profileLink = provider.profileLink ?? '';
  const providerName = `${provider.firstName} ${provider.lastName}`;

  /*
   * Using a variable to hide the profile link instead of removing it:
   * They want to do some AB testing and might ask to add this back in at a later time
   * See https://linear.app/awell/issue/ET-418/remove-link-to-bio
   */
  const showProfileLink = false;

  return (
    <div key={provider.id} className='rounded-md border-1 bg-white p-4'>
      <div className='flex gap-4 align-center justify-between'>
        <div className='flex gap-4 align-center'>
          <ProviderAvatar name={providerName} image={provider.image} />
          <div className='flex flex-col justify-center'>
            <h3 className='text-slate-800 text-lg m-0 font-semibold'>
              {providerName}
            </h3>
            <div className='flex flex-col sm:flex-row sm:items-center'>
              {location.length > 0 && (
                <span className='text-slate-600 text-md'>
                  {toFullNameState(location)}
                </span>
              )}
              {showProfileLink && (
                <>
                  {location.length > 0 && profileLink.length > 0 && (
                    <span className='text-slate-600 text-md hidden sm:inline px-1'>
                      •
                    </span>
                  )}
                  {profileLink.length > 0 && (
                    <LinkToProfileItem link={profileLink} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className='flex'>
          <Slot count={provider.events?.length ?? 0} />
        </div>
      </div>
      <div className={clsx('mt-4 bg-slate-100 rounded-md p-3')}>
        <div>
          <ul className='flex flex-wrap list-none m-0 p-0 gap-y-4 mb-4'>
            {provider.gender && (
              <SingleItem
                label='Gender'
                value={toFullNameGender(provider.gender)}
              />
            )}
            {provider.ethnicity && (
              <SingleItem label='Ethnicity' value={provider.ethnicity} />
            )}
          </ul>
          <ul className='flex flex-wrap list-none m-0 p-0 gap-y-4 mb-4'>
            {facilities.length > 0 && (
              <SingleItem
                label={`Clinic Location${facilities.length > 1 ? 's' : ''}`}
                value={facilities.map((f) => f.slice(5)).join(', ')}
              />
            )}
            {provider.bio && <BioItem label='Bio' value={provider.bio} />}
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

const SingleItem: FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <li className='flex-1 basis-1/2'>
      <span className='font-semibold text-primary'>{label}: </span>
      <span>{value}</span>
    </li>
  );
};

const BioItem: FC<{ label: string; value: string }> = ({ label, value }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleBio = () => {
    setIsExpanded(!isExpanded);
  };
  const classes =
    'text-blue-500 rounded-full text-sm text-blue font-medium flex items-center justify-center';
  return (
    <li className='flex-1 basis-full'>
      <span className='font-semibold text-primary'>{label}: </span>
      {isExpanded ? (
        <>
          <span>{value}</span>
          <button onClick={toggleBio} className={classes}>
            {' < Hide'}
          </button>
        </>
      ) : (
        <>
          <span>{value.substring(0, 120)}...</span>
          <button onClick={toggleBio} className={classes}>
            {' > Show more'}
          </button>
        </>
      )}
    </li>
  );
};

const LinkToProfileItem: FC<{ link: string }> = ({ link }) => {
  return (
    <a
      href={link}
      target='_blank'
      rel='noopener noreferrer'
      className='link text-blue-500 no-underline hover:underline'
      aria-label={`Visit provider profile page`}
    >
      View Profile
    </a>
  );
};

const Slot: FC<{ count: number }> = ({ count }) => {
  const slotText = count === 1 ? 'slot' : 'slots';
  return (
    <div>
      <div
        className={clsx(
          'rounded-full text-sm text-white text-center font-medium my-2 flex items-center justify-center px-3 py-1',
          {
            'bg-slate-300': count === 0,
            'bg-yellow-500': count > 0 && count <= 2,
            'bg-green-600': count > 2
          }
        )}
        aria-hidden='true'
      >
        {count === 0 ? 'No slots' : `${count} ${slotText} available`}
      </div>
    </div>
  );
};
