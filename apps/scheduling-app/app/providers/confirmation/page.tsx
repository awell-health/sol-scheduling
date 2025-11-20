import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

type ConfirmationPageProps = {
  searchParams: Promise<{
    providerId?: string;
    providerName?: string;
    providerImage?: string;
    startsAt?: string;
    duration?: string;
    locationType?: string;
    facility?: string;
    state?: string;
  }>;
};

const PLACEHOLDER_AVATAR = '/images/avatar.svg';

export default async function AppointmentConfirmationPage({
  searchParams
}: ConfirmationPageProps) {
  const { startsAt, providerName, providerImage, duration, facility, state, locationType } = await searchParams;

  const formattedDateTime = startsAt
    ? format(new Date(startsAt), "EEEE, MMMM d 'at' h:mm a")
    : null;

  let locationLabel = 'Location to be confirmed';
  if (locationType === 'In-Person' || locationType === 'Telehealth') {
    locationLabel =
      locationType === 'In-Person' ? 'In-person visit' : 'Virtual video visit';
  }

  const fullLocation = [
    locationLabel,
    facility ? `· ${facility}` : null,
    state ? `· ${state}` : null
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <main className='min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto flex min-h-[70vh] max-w-3xl flex-col gap-6'>
        <header className='space-y-1'>
          <p className='text-sm font-semibold uppercase tracking-wide text-secondary-foreground'>
            SOL Mental Health
          </p>
          <h1 className='text-3xl font-bold text-primary'>
            Your appointment is booked
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
                src={providerImage ?? PLACEHOLDER_AVATAR}
                alt={providerName ?? 'Your provider'}
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
                  {providerName}
                </p>
              </div>

              <div className='grid gap-3 text-sm text-slate-700 sm:grid-cols-2'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                    Date &amp; time
                  </p>
                  <p className='mt-0.5'>
                    {formattedDateTime ?? 'To be confirmed'}
                    {duration
                      ? ` · ${duration} minute appointment`
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

        <div className='flex flex-wrap items-center justify-between gap-3'>
          <Link
            href='/providers'
            className='inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50'
          >
            Back to providers
          </Link>
          <p className='text-xs text-slate-500'>
            You&apos;ll receive a confirmation shortly with details on how to join
            or where to go for your visit.
          </p>
        </div>
      </div>
    </main>
  );
}


