 'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useState } from 'react';
import { ProviderSummary } from '../_lib/types';
import { ProviderBio } from './ProviderBio';
import { MapPinIcon, VideoCameraIcon } from './icons/ProviderIcons';

type ProviderCardProps = {
  provider: ProviderSummary;
  onSelect: (providerId: string) => void;
  disabled?: boolean;
};

const PLACEHOLDER_AVATAR = '/images/avatar.svg';

export function ProviderCard({
  provider,
  onSelect,
  disabled = false
}: ProviderCardProps) {
  const router = useRouter();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const providerName =
    provider.firstName && provider.lastName
      ? `${provider.firstName} ${provider.lastName}`
      : provider.firstName || provider.lastName || 'Provider';

  const locationFacility = provider.location?.facility;
  const locationState = provider.location?.state;

  const events = provider.events ?? [];
  const sortedSlots = [...events]
    .filter((slot) => !slot.booked)
    .sort(
      (a, b) =>
        new Date(a.slotstart).getTime() - new Date(b.slotstart).getTime()
    );
  const mobileSlots = sortedSlots.slice(0, 2);
  const desktopSlots = sortedSlots.slice(0, 6);

  const slotLabel = (slot: (typeof events)[number]) => {
    const date = new Date(slot.slotstart);
    return format(date, 'EEE M/d, h:mm a');
  };

  const slotModes = (slot: (typeof events)[number]) => {
    const mode = slot.location ?? slot.eventType;
    const isTelehealth = mode === 'Telehealth';
    const isInPerson = mode === 'In-Person';

    // Business rule: any in-person visit can also be virtual
    return {
      inPerson: isInPerson,
      virtual: isTelehealth || isInPerson
    };
  };

  const handleSelectSlot = (slot: (typeof events)[number]) => {
    if (disabled) return;
    setSelectedEventId(slot.eventId);
    router.push(
      `/providers/${provider.id}?eventId=${encodeURIComponent(slot.eventId)}`
    );
  };

  const handleSeeFullAvailability = () => {
    if (disabled) return;
    onSelect(provider.id);
  };

  return (
    <article className='flex flex-col gap-2 md:gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:flex-row'>
      {/* Avatar column (desktop) and mobile header with avatar on the right */}
      <div className='flex md:gap-4 sm:flex-col sm:justify-between'>
        <div className='flex w-full items-start justify-between sm:flex-col sm:items-start sm:gap=2'>
          {/* Mobile: name and location on the left */}
          <div className='flex-1 sm:hidden'>
            <h3 className='text-lg font-semibold text-primary'>{providerName}</h3>
            {(locationFacility || locationState) && (
              <div className='mt-1 flex items-center gap-1 text-sm font-semibold text-secondary-foreground'>
                <MapPinIcon className='h-4 w-4' />
                <span>
                  {locationFacility}
                  {locationFacility && locationState ? ' • ' : ''}
                  {locationState}
                </span>
              </div>
            )}
          </div>

          {/* Avatar – right on mobile, left column on desktop */}
          <div className='relative h-24 w-24 flex-none overflow-hidden rounded-full bg-secondary'>
            <Image
              src={provider.image || PLACEHOLDER_AVATAR}
              placeholder='blur'
              blurDataURL='/images/avatar.svg'
              alt={providerName}
              fill
              sizes='96px'
              unoptimized
              className='object-cover'
            />
          </div>
        </div>
      </div>

      <div className='hidden w-px bg-slate-200 sm:block sm:my-2' />

      <div className='flex flex-1 flex-col gap-2 md:gap-3'>
        {/* Desktop: name and location (avatar is in left column) */}
        <div className='hidden sm:block'>
          <h3 className='text-lg font-semibold text-primary'>{providerName}</h3>
          {(locationFacility || locationState) && (
            <div className='mt-1 flex items-center gap-1 text-sm font-semibold text-secondary-foreground'>
              <MapPinIcon className='h-4 w-4' />
              <span>
                {locationFacility}
                {locationFacility && locationState ? ' • ' : ''}
                {locationState}
              </span>
            </div>
          )}
        </div>

        <ProviderBio
          text={provider.bio}
          profileLink={provider.profileLink}
          collapsible
        />

        {sortedSlots.length > 0 && (
          <>
            {/* Mobile: one row of two times, second row CTA */}
            <div className='mt-2 grid grid-cols-2 gap-2 md:hidden'>
              {mobileSlots.map((slot) => {
              const isSelected = selectedEventId === slot.eventId;
              const { inPerson, virtual } = slotModes(slot);

              return (
                <button
                  key={slot.eventId}
                  type='button'
                  onClick={() => handleSelectSlot(slot)}
                  disabled={disabled}
                  className={clsx(
                    'rounded-md px-1.5 py-2 text-xs font-medium transition border',
                    disabled
                      ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                      : isSelected
                        ? 'border-primary bg-primary text-primary-foreground shadow-card'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                  )}
                >
                  <span className='flex items-center justify-center gap-1'>
                    <span className='flex items-center justify-center gap-0'>
                      {inPerson && (
                        <MapPinIcon className='h-3 w-3 text-secondary-foreground' />
                      )}
                      {virtual && (
                        <VideoCameraIcon className='h-3 w-3 text-secondary-foreground' />
                      )}
                    </span>
                    <span className='tracking-tight'>{slotLabel(slot)}</span>
                  </span>
                </button>
              );
              })}
            </div>

            {/* Desktop: up to 3 columns x 2 rows of times, CTA below */}
            <div className='mt-2 hidden grid-cols-3 gap-2 md:grid'>
              {desktopSlots.map((slot) => {
                const isSelected = selectedEventId === slot.eventId;
                const { inPerson, virtual } = slotModes(slot);

                return (
                  <button
                    key={slot.eventId}
                    type='button'
                    onClick={() => handleSelectSlot(slot)}
                    disabled={disabled}
                    className={clsx(
                      'rounded-md px-3 py-2 text-xs font-semibold transition border',
                      disabled
                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                        : isSelected
                          ? 'border-primary bg-primary text-primary-foreground shadow-card'
                          : 'border-slate-200 bg-white text-slate-800 hover:bg-secondary/20'
                    )}
                  >
                    <span className='flex items-center justify-center gap-1'>
                      {inPerson && (
                        <MapPinIcon className='h-3 w-3 text-secondary-foreground' />
                      )}
                      {virtual && (
                        <VideoCameraIcon className='h-3 w-3 text-secondary-foreground' />
                      )}
                      <span>{slotLabel(slot)}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type='button'
              onClick={handleSeeFullAvailability}
              disabled={disabled}
              className={clsx(
                'mt-2 w-full rounded-md px-3 py-2 text-xs font-semibold transition border',
                disabled
                  ? 'cursor-not-allowed border-slate-200 bg-slate-300 text-white'
                  : 'border-secondary bg-secondary text-secondary-foreground shadow-card hover:bg-secondary/80'
              )}
            >
              See full availability
            </button>
          </>
        )}
      </div>
    </article>
  );
}
