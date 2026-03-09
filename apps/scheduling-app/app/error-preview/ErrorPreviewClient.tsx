'use client';

import Image from 'next/image';
import Link from 'next/link';

const SOL_TEAL = '#517C7D';
const SOL_TEAL_DARK = '#415457';
const SOL_SLATE_200 = '#CBD6D8';

export function ErrorPreviewClient() {
  return (
    <div className='min-h-screen bg-slate-100 p-8'>
      <div className='mx-auto max-w-5xl'>
        <h1 className='mb-2 text-2xl font-bold text-slate-800'>Error Page Preview</h1>
        <p className='mb-8 text-sm text-slate-500'>Dev only — this page is not accessible in production.</p>

        <div className='grid gap-8 lg:grid-cols-2'>
          {/* Global Error Preview */}
          <div>
            <h2 className='mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500'>
              global-error.tsx
            </h2>
            <p className='mb-3 text-xs text-slate-400'>
              Replaces the entire page (including root layout). Uses inline styles only.
            </p>
            <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg'>
              {/* Simulated header */}
              <header
                style={{
                  borderBottom: `1px solid ${SOL_SLATE_200}`,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                }}
              >
                <div
                  style={{
                    maxWidth: '56rem',
                    margin: '0 auto',
                    display: 'flex',
                    height: '3.5rem',
                    alignItems: 'center',
                    padding: '0 1rem',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: SOL_TEAL_DARK }}>
                    SOL Mental Health
                  </p>
                </div>
              </header>

              <main
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '28rem',
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                <div style={{ marginBottom: '2rem' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src='/images/sol_logo.svg' alt='SOL Mental Health' width={123} height={83} />
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 0.75rem', color: SOL_TEAL_DARK }}>
                  We hit a snag
                </h1>
                <p style={{ fontSize: '1rem', color: '#6A7A7F', margin: '0 0 2rem', maxWidth: '28rem', lineHeight: 1.6 }}>
                  Something unexpected happened, but we can get you back on track.
                </p>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a
                  href='/'
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.375rem',
                    backgroundColor: SOL_TEAL,
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  Schedule your appointment
                </a>
                <p style={{ fontSize: '0.8125rem', color: '#8B9CA0', marginTop: '2.5rem' }}>
                  Or, please call us at{' '}
                  <a href='tel:8447451861' style={{ color: SOL_TEAL, textDecoration: 'none', fontWeight: 500 }}>
                    (844) 745-1861
                  </a>{' '}
                  to schedule your appointment.
                </p>
              </main>
            </div>
          </div>

          {/* Route Error Preview */}
          <div>
            <h2 className='mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500'>
              error.tsx
            </h2>
            <p className='mb-3 text-xs text-slate-400'>
              Renders inside the root layout (header already present). Uses Tailwind.
            </p>
            <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg'>
              {/* Simulated header (from root layout) */}
              <header className='border-b border-slate-200 bg-white/95'>
                <div className='mx-auto flex h-14 max-w-4xl items-center px-4'>
                  <p className='text-sm font-semibold uppercase tracking-wide text-secondary-foreground'>
                    SOL Mental Health
                  </p>
                </div>
              </header>

              <main className='flex min-h-[28rem] flex-col items-center justify-center px-4 py-8 text-center'>
                <Image
                  src='/images/sol_logo.svg'
                  alt='SOL Mental Health'
                  width={123}
                  height={83}
                  className='mb-8'
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
                  <a href='tel:8447451861' className='font-medium text-primary hover:underline'>
                    (844) 745-1861
                  </a>{' '}
                  to schedule your appointment.
                </p>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
