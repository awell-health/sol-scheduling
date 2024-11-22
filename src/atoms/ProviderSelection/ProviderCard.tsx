import { FC, useState } from 'react';
import { uniq } from 'lodash-es';
import clsx from 'clsx';

import { toFullNameState, toFullNameGender } from '@/lib/utils';
import type { Provider } from './types';
import { ProviderAvatar } from '../ProviderAvatar';
import { AvailabilitySlots } from '../AvailabilitySlots';
import { DeliveryMethod } from '@/lib/api/schema';

export type ProviderProps = {
  provider: Provider;
  onSelect: (id: string) => void;
  deliveryMethod?: DeliveryMethod;
  text?: {
    button?: string;
  };
};

export const ProviderCard: FC<ProviderProps> = ({
  deliveryMethod,
  provider,
  onSelect,
  text
}) => {
  const { button = 'Select Provider' } = text || {};

  const facilities = uniq((provider?.events ?? []).map((e) => e.facility));

  return (
    <div key={provider.id} className='rounded-md border-1 bg-white p-4'>
      <ProviderHeader provider={provider} deliveryMethod={deliveryMethod} />
      <div className={clsx('mt-4 bg-slate-50 rounded-md p-3')}>
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

const ProviderHeader: FC<{
  provider: Provider;
  deliveryMethod?: DeliveryMethod;
}> = ({ provider, deliveryMethod }) => {
  /*
   * Using a variable to hide the profile link instead of removing it:
   * They want to do some AB testing and might ask to add this back in at a later time
   * See https://linear.app/awell/issue/ET-418/remove-link-to-bio
   */
  const showProfileLink = false;
  const profileLink = provider.profileLink ?? '';
  const providerName = `${provider.firstName} ${provider.lastName}`;
  const location = provider.location?.state ?? '';
  const slots =
    deliveryMethod === 'In-Person'
      ? provider.events
          .filter((slot) => slot.location === 'In-Person')
          .slice(0, 3)
      : provider.events.slice(0, 3);
  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center sm:justify-between'>
      <div className='self-center sm:self-auto'>
        <ProviderAvatar
          name={providerName}
          image={provider.image}
          classes='w-32 h-32'
        />
      </div>
      <div className='w-full sm:w-auto sm:gap-y-6'>
        <div className='flex flex-col sm:flex-row items-center sm:justify-between justify-center mb-3'>
          <div>
            <h3 className='text-slate-800 text-lg m-0 font-semibold text-center sm:text-left'>
              {providerName}
            </h3>
            <div className='flex flex-col sm:flex-row justify-center sm:justify-start items-center'>
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

          <div className='self-center sm:self-auto mt-2 sm:mt-0'>
            <Slot count={provider.events?.length ?? 0} />
          </div>
        </div>
        <AvailabilitySlots
          timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
          slots={slots}
          deliveryMethod={deliveryMethod}
        />
      </div>
    </div>
  );
};

const mainText = 'font-semibold text-primary';
const subText = 'text-slate-600 text-md';

const SingleItem: FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <li className='flex-1 basis-1/2'>
      <span className={subText}>{label}: </span>
      <span className={mainText}>{value}</span>
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
          <span className='text-slate-600 text-md'>{value}</span>
          <button onClick={toggleBio} className={classes}>
            {' < Hide'}
          </button>
        </>
      ) : (
        <>
          <span className='text-slate-600 text-md'>
            {value.substring(0, 120)}...
          </span>
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
    <div
      className={clsx(
        'rounded-full text-sm text-white text-center font-medium flex items-center justify-center px-3 py-1',
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
  );
};
