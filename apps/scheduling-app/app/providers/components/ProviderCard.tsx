'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ProviderSummary } from '../_lib/types';
import { ProviderBio } from './ProviderBio';
import { MapPinIcon, VideoCameraIcon } from './icons/ProviderIcons';
import { Button } from '../../../components/ui/button';

type ProviderCardProps = {
  provider: ProviderSummary;
  onSelect: (providerId: string) => void;
  disabled?: boolean;
  returnUrl?: string;
};

const PLACEHOLDER_AVATAR = '/images/avatar.svg';

export function ProviderCard({
  provider,
  onSelect,
  disabled = false,
  returnUrl
}: ProviderCardProps) {
  const router = useRouter();
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
    const params = new URLSearchParams({
      eventId: slot.eventId
    });
    if (returnUrl) {
      params.set('returnUrl', returnUrl);
    }
    router.push(`/providers/${provider.id}?${params.toString()}`);
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
                const { inPerson, virtual } = slotModes(slot);

                return (
                  <Button
                    key={slot.eventId}
                    variant='outline'
                    size='sm'
                    onClick={() => handleSelectSlot(slot)}
                    disabled={disabled}
                    flashOnClick
                    className='px-1.5 py-2 text-xs'
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
                  </Button>
                );
              })}
            </div>

            {/* Desktop: up to 3 columns x 2 rows of times, CTA below */}
            <div className='mt-2 hidden grid-cols-3 gap-2 md:grid'>
              {desktopSlots.map((slot) => {
                const { inPerson, virtual } = slotModes(slot);

                return (
                  <Button
                    key={slot.eventId}
                    variant='outline'
                    size='sm'
                    onClick={() => handleSelectSlot(slot)}
                    disabled={disabled}
                    flashOnClick
                    className='px-3 py-2 text-xs'
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
                  </Button>
                );
              })}
            </div>

            <Button
              variant='secondary'
              size='sm'
              onClick={handleSeeFullAvailability}
              disabled={disabled}
              flashOnClick
              className='w-full text-xs'
            >
              See full availability
            </Button>
          </>
        )}
      </div>
    </article>
  );
}
