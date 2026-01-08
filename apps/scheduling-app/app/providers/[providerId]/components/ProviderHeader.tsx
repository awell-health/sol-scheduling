'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProviderSummary } from '../../_lib/types';
import { ProviderBio } from '../../components/ProviderBio';
import { MapPinIcon } from '../../components/icons/ProviderIcons';

const PLACEHOLDER_AVATAR = '/images/avatar.svg';

interface SelectedSlotSummary {
  when: string;
  meta: string;
}

interface ProviderHeaderProps {
  provider: ProviderSummary;
  selectedSlotSummary: SelectedSlotSummary | null;
}

/**
 * Provider header with sticky scroll behavior.
 * Shows provider avatar, name, location, and bio.
 */
export function ProviderHeader({
  provider,
  selectedSlotSummary,
}: ProviderHeaderProps) {
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const providerName =
    provider.firstName && provider.lastName
      ? `${provider.firstName} ${provider.lastName}`
      : provider.firstName || provider.lastName || 'Provider';

  // Observe header visibility to toggle sticky header
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyHeader(!entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(headerEl);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Sticky header (appears when main header scrolls out of view) */}
      <div
        className={`pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center transition-opacity duration-200 ${
          showStickyHeader ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className='pointer-events-auto w-full border-b border-slate-200 bg-white/90 backdrop-blur-md'>
          <div className='mx-auto flex max-w-3xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8'>
            <Link
              href='/providers'
              className='flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-slate-600 hover:text-slate-900'
              aria-label='Back to providers'
            >
              ←
            </Link>
            <div className='relative h-8 w-8 overflow-hidden rounded-full bg-slate-100'>
              <Image
                src={provider.image || PLACEHOLDER_AVATAR}
                alt={providerName}
                sizes='32px'
                unoptimized
                fill
                placeholder='blur'
                blurDataURL='/images/avatar.svg'
                className='object-cover'
              />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-semibold text-slate-900'>
                {providerName}
              </p>
              {(provider.location?.facility || provider.location?.state) && (
                <p className='truncate text-xs text-slate-600'>
                  {provider.location?.facility}
                  {provider.location?.facility && provider.location?.state ? (
                    <span className='text-slate-400'>
                      {' '}
                      · {provider.location.state}
                    </span>
                  ) : (
                    provider.location?.state
                  )}
                </p>
              )}
              {selectedSlotSummary && (
                <p className='truncate text-[11px] text-slate-500'>
                  {selectedSlotSummary.when} • {selectedSlotSummary.meta}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header section */}
      <section className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <header
          ref={headerRef}
          className='flex flex-col gap-4 md:flex-row md:items-start md:gap-6'
        >
          <div className='relative h-32 w-32 flex-none overflow-hidden rounded-full bg-slate-100'>
            <Image
              src={provider.image || PLACEHOLDER_AVATAR}
              alt={providerName}
              sizes='128px'
              unoptimized
              fill
              placeholder='blur'
              blurDataURL='/images/avatar.svg'
              className='object-cover'
            />
          </div>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold text-slate-900'>{providerName}</h1>
            {(provider.location?.facility || provider.location?.state) && (
              <div className='flex items-center gap-1 text-sm text-slate-600'>
                <MapPinIcon className='h-4 w-4 text-secondary-foreground' />
                <span>
                  {provider.location?.facility}
                  {provider.location?.facility && provider.location?.state ? (
                    <span className='text-slate-400'>
                      {' '}
                      · {provider.location.state}
                    </span>
                  ) : (
                    provider.location?.state
                  )}
                </span>
              </div>
            )}
          </div>
        </header>
        <div className='mt-4'>
          <ProviderBio
            text={provider.bio}
            profileLink={provider.profileLink}
            showIntroHeading
          />
        </div>
      </section>
    </>
  );
}



