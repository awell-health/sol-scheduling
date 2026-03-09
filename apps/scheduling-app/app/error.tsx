'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Error({
  error,
  reset: _reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isChunkLoadError =
    error.name === 'ChunkLoadError' ||
    error.message?.includes('Loading chunk') ||
    error.message?.includes('Failed to fetch dynamically imported module');

  if (isChunkLoadError) {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
    return null;
  }

  return (
    <main className='flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-8 text-center'>
      <Image
        src='/images/sol_logo.svg'
        alt='SOL Mental Health'
        width={123}
        height={83}
        className='mb-8'
        priority
      />

      <h1 className='mb-3 text-2xl font-semibold text-secondary-foreground'>
        We hit a snag
      </h1>
      <p className='mb-8 max-w-md text-base leading-relaxed text-slate-500'>
        Something unexpected happened, but we can get you back on track.
      </p>

      <Link
        href='/'
        className='rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90'
      >
        Schedule your appointment
      </Link>

      <p className='mt-10 text-xs text-slate-400'>
        Or, please call us at{' '}
        <a
          href='tel:8447451861'
          className='font-medium text-primary hover:underline'
        >
          (844) 745-1861
        </a>{' '}
        to schedule your appointment.
      </p>
    </main>
  );
}
