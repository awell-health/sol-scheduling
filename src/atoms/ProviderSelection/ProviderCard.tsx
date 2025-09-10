import { FC, useState } from 'react';
import { uniq } from 'lodash-es';
import clsx from 'clsx';

import { toFullNameState } from '@/lib/utils';
import type { Provider } from './types';
import { ProviderAvatar } from '../ProviderAvatar';
import { AvailabilitySlots } from '../AvailabilitySlots';
import { DeliveryMethod } from '@/lib/api/schema';
import locationIcon from '@/assets/location-icon.svg';

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
  const facilities = uniq((provider?.events ?? []).map((e) => e.facility));
  const providerName = `${provider.firstName ?? ''} ${provider.lastName ?? ''}`;

  return (
    <div
      key={provider.id}
      className='sol-rounded-md sol-border-1 sol-bg-white sol-flex sol-justify-center sol-p-4 sol-gap-3'
    >
      <div className='sol-flex sol-flex-col sol-justify-evenly sol-gap-2 sol-w-auto'>
        <ProviderAvatar
          name={providerName}
          image={provider.image}
          classes='sm:sol-w-36 sm:sol-h-36 sol-w-28 sol-h-28'
        />
        <div className='sol-self-center sm:sol-self-auto'>
          <Slot count={provider.events?.length ?? 0} />
        </div>
      </div>
      <div className='sol-border' />
      <ProviderHeader
        provider={provider}
        deliveryMethod={deliveryMethod}
        facilities={facilities}
        text={text?.button}
        onSelect={onSelect}
      />
    </div>
  );
};

const ProviderHeader: FC<{
  provider: Provider;
  deliveryMethod?: DeliveryMethod;
  facilities: string[];
  onSelect: (id: string) => void;
  text?: string;
}> = ({ provider, deliveryMethod, facilities, text, onSelect }) => {
  const { button = 'Select Provider' } = { button: text } || {};
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
    <div className='sol-flex sol-flex-col sol-items-baseline sol-gap-3 sol-justify-evenly'>
      <h3 className='sol-text-slate-800 sol-text-lg sol-m-0 sol-font-semibold sol-text-center sm:sol-text-left'>
        {' '}
        {providerName}{' '}
      </h3>{' '}
      <div className='sol-grid sol-grid-cols-3 sol-gap-3 sol-justify-start'>
        {facilities &&
          facilities.length > 0 &&
          facilities.map((f) => <SingleItem key={f} value={f.slice(5)} />)}
      </div>
      <div>
        <ul className='sol-flex sol-flex-wrap sol-list-none sol-m-0 sol-p-0 sol-gap-y-4'>
          {provider.bio && <BioItem value={provider.bio} />}
        </ul>
      </div>
      {location.length > 0 && (
        <div className='sol-flex sol-flex-col sm:sol-flex-row sol-justify-center sm:sol-justify-start sol-items-center'>
          (
          <span className='sol-text-slate-600 sol-text-md'>
            {' '}
            {toFullNameState(location)}{' '}
          </span>
          )
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
      )}
      <AvailabilitySlots
        timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
        slots={slots}
        deliveryMethod={deliveryMethod}
      />
      <div className='sol-rounded-md sol-w-full'>
        <button
          onClick={() => onSelect(provider.id)}
          className='sol-btn sol-btn-primary sol-w-full sol-min-h-10 sol-h-10'
        >
          {button}
        </button>
      </div>
    </div>
  );
};

const SingleItem: FC<{ value: string }> = ({ value }) => {
  return (
    <div className='sol-flex sol-items-center' aria-hidden='true'>
      <img
        src={locationIcon}
        alt='Location icon'
        className='sol-w-5 sol-h-5 sol-text-slate-500'
      />
      <div className='sol-p-1 sol-text-center'>
        <span className='sol-font-semibold sol-text-primary sol-text-sm'>
          {value}
        </span>
      </div>
    </div>
  );
};

const BioItem: FC<{ value: string }> = ({ value }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleBio = () => {
    setIsExpanded(!isExpanded);
  };
  const classes =
    'sol-text-blue-500 sol-rounded-full sol-text-sm sol-text-blue sol-font-medium ';
  return (
    <li className='sol-flex-1 sol-basis-full'>
      {isExpanded ? (
        <div>
          <span className='sol-text-slate-600 sol-text-md'>{value}</span>
          <button onClick={toggleBio} className={classes}>
            {'Hide'}
          </button>
        </div>
      ) : (
        <div>
          <span className='sol-text-slate-600 sol-text-md'>
            {value.substring(0, 120)}...{' '}
            <button onClick={toggleBio} className={classes}>
              {'Read more'}
            </button>
          </span>
        </div>
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
