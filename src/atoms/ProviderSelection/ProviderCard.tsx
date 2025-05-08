import { FC, useState } from 'react';
import { uniq } from 'lodash-es';
import clsx from 'clsx';

import { toFullNameState } from '@/lib/utils';
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
    <div
      key={provider.id}
      className='sol-rounded-md sol-border-1 sol-bg-white sol-p-4'
    >
      <ProviderHeader provider={provider} deliveryMethod={deliveryMethod} />
      <div className={clsx('sol-mt-4 sol-bg-slate-50 sol-rounded-md sol-p-3')}>
        <div>
          {/* <ul className='sol-flex sol-flex-wrap sol-list-none sol-m-0 sol-p-0 sol-gap-y-4 sol-mb-4'>
            {provider.gender && (
              <SingleItem
                label='Gender'
                value={toFullNameGender(provider.gender)}
              />
            )}
            {provider.ethnicity && (
              <SingleItem label='Ethnicity' value={provider.ethnicity} />
            )}
          </ul> */}
          <ul className='sol-flex sol-flex-wrap sol-list-none sol-m-0 sol-p-0 sol-gap-y-4 sol-mb-4'>
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
            className={clsx('sol-btn sol-btn-primary sol-w-full')}
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
          .filter((slot) => slot.eventType === 'In-Person')
          .slice(0, 3)
      : provider.events.slice(0, 3);
  return (
    <div className='sol-flex sol-flex-col sm:sol-flex-row sol-items-start sm:sol-items-center sm:sol-justify-between'>
      <div className='sol-self-center sm:sol-self-auto'>
        <ProviderAvatar
          name={providerName}
          image={provider.image}
          classes='sol-w-32 sol-h-32'
        />
      </div>
      <div className='sol-w-full sm:sol-w-auto sm:sol-gap-y-6'>
        <div className='sol-flex sol-flex-col sm:sol-flex-row sol-items-center sm:sol-justify-between sol-justify-center sol-mb-3'>
          <div>
            <h3 className='sol-text-slate-800 sol-text-lg sol-m-0 sol-font-semibold sol-text-center sm:sol-text-left'>
              {' '}
              {providerName}{' '}
            </h3>{' '}
            <div className='sol-flex sol-flex-col sm:sol-flex-row sol-justify-center sm:sol-justify-start sol-items-center'>
              {location.length > 0 && (
                <span className='sol-text-slate-600 sol-text-md'>
                  {' '}
                  {toFullNameState(location)}{' '}
                </span>
              )}{' '}
              {showProfileLink && (
                <>
                  {' '}
                  {location.length > 0 && profileLink.length > 0 && (
                    <span className='sol-text-slate-600 sol-text-md sol-hidden sm:sol-inline sol-px-1'>
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

          <div className='sol-self-center sm:sol-self-auto sol-mt-2 sm:sol-mt-0'>
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

const mainText = 'sol-font-semibold sol-text-primary';
const subText = 'sol-text-slate-600 sol-text-md';

const SingleItem: FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <li className='sol-flex-1 sol-basis-1/2'>
      {' '}
      <span className={subText}>{label}: </span>{' '}
      <span className={mainText}>{value}</span>{' '}
    </li>
  );
};

const BioItem: FC<{ label: string; value: string }> = ({ label, value }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleBio = () => {
    setIsExpanded(!isExpanded);
  };
  const classes =
    'sol-text-blue-500 sol-rounded-full sol-text-sm sol-text-blue sol-font-medium sol-flex sol-items-center sol-justify-center';
  return (
    <li className='sol-flex-1 sol-basis-full'>
      {' '}
      <span className='sol-font-semibold sol-text-primary'>{label}: </span>{' '}
      {isExpanded ? (
        <>
          {' '}
          <span className='sol-text-slate-600 sol-text-md'>{value}</span>{' '}
          <button onClick={toggleBio} className={classes}>
            {' '}
            {' < Hide'}
          </button>
        </>
      ) : (
        <>
          <span className='sol-text-slate-600 sol-text-md'>
            {' '}
            {value.substring(0, 120)}...{' '}
          </span>{' '}
          <button onClick={toggleBio} className={classes}>
            {' '}
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
      className='sol-link sol-text-blue-500 sol-no-underline hover:sol-underline'
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
        'sol-rounded-full sol-text-sm sol-text-white sol-text-center sol-font-medium sol-flex sol-items-center sol-justify-center sol-px-3 sol-py-1',
        {
          'sol-bg-slate-300': count === 0,
          'sol-bg-yellow-500': count > 0 && count <= 2,
          'sol-bg-green-600': count > 2
        }
      )}
      aria-hidden='true'
    >
      {count === 0 ? 'No slots' : `${count} ${slotText} available`}
    </div>
  );
};
