'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { BeginIntakeButton } from './BeginIntakeButton';
import { ScrollToTop } from './ScrollToTop';
import { useConfirmationData } from '../../hooks/useConfirmationData';

const PLACEHOLDER_AVATAR = '/images/avatar.svg';

type ConfirmationPageClientProps = {
  /** Confirmation ID (workflow run ID) */
  confirmationId: string;
};

export function ConfirmationPageClient({ confirmationId }: ConfirmationPageClientProps) {
  const { isLoading, data: confirmationData, error } = useConfirmationData(confirmationId);

  if (isLoading) {
    return (
      <>
        <ScrollToTop />
        <main className='min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8'>
          <div className='mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-4'>
            <h1 className='text-2xl font-bold text-slate-900'>Loading confirmation...</h1>
            <p className='text-sm text-slate-600'>
              Please wait while we fetch your confirmation details...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (error || !confirmationData) {
    return (
      <>
        <ScrollToTop />
        <main className='min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8'>
          <div className='mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-4'>
            <h1 className='text-2xl font-bold text-slate-900'>Confirmation not found</h1>
            <p className='text-sm text-slate-600'>
              {error || 'Your booking may still be processing. Please wait a moment and refresh, or contact support if this persists.'}
            </p>
          </div>
        </main>
      </>
    );
  }

  const { eventDetails, sessionUrl } = confirmationData;

  const formattedDateTime = eventDetails.startsAt
    ? format(new Date(eventDetails.startsAt), "EEEE, MMMM d 'at' h:mm a")
    : null;

  let locationLabel = 'Location to be confirmed';
  if (eventDetails.locationType === 'In-Person' || eventDetails.locationType === 'Telehealth') {
    locationLabel =
      eventDetails.locationType === 'In-Person' ? 'In-person visit' : 'Virtual video visit';
  }

  const fullLocation = [
    locationLabel,
    eventDetails.facility ? `· ${eventDetails.facility}` : null
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <ScrollToTop />
      <main className='min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto flex max-w-3xl flex-col gap-6'>
          <header className='space-y-1'>
            <h1 className='text-3xl font-bold text-primary'>
              Your appointment is selected
            </h1>
            <p className='max-w-xl text-sm text-slate-600'>
              We&apos;ve received your request and will send a confirmation with any
              additional details. Below is a summary of your appointment.
            </p>
          </header>

          <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6'>
              <div className='relative h-20 w-20 flex-none overflow-hidden rounded-full bg-slate-100 sm:h-24 sm:w-24'>
                <Image
                  src={eventDetails.providerImage ?? PLACEHOLDER_AVATAR}
                  alt={eventDetails.providerName ?? 'Your provider'}
                  sizes='96px'
                  fill
                  unoptimized
                  className='object-cover'
                />
              </div>
              <div className='flex-1 space-y-2'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                    Provider
                  </p>
                  <p className='text-lg font-semibold text-slate-900'>
                    {eventDetails.providerName}
                  </p>
                </div>

                <div className='grid gap-3 text-sm text-slate-700 sm:grid-cols-2'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                      Date &amp; time
                    </p>
                    <p className='mt-0.5'>
                      {formattedDateTime ?? 'To be confirmed'}
                      {eventDetails.duration
                        ? ` · ${eventDetails.duration} minute appointment`
                        : null}
                    </p>
                  </div>

                  <div>
                    <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                      Location
                    </p>
                    <p className='mt-0.5'>{fullLocation}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className='space-y-4'>
            <p className='text-xs text-slate-500'>
              We will ask you to fill in a few additional details to complete your booking. Please click below.
            </p>
            <div className='flex flex-wrap items-center gap-3'>
              <BeginIntakeButton sessionUrl={sessionUrl} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

