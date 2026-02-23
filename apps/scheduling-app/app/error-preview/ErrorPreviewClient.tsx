'use client';

import Image from 'next/image';
import Link from 'next/link';

const SOL_TEAL = '#517C7D';
const SOL_TEAL_DARK = '#415457';
const SOL_SLATE_200 = '#CBD6D8';

function SolLogoInline() {
  return (
    <svg width='123' height='83' viewBox='0 0 123 83' fill='none' xmlns='http://www.w3.org/2000/svg' aria-label='SOL Mental Health'>
      <path d='M19.2981 26.8121C19.2981 32.2904 23.635 35.0772 27.9719 36.8412C31.8479 38.421 33.8312 40.0463 33.8312 42.4127C33.8312 44.4085 32.0309 45.9883 29.6321 45.9883C26.6325 45.9883 22.8964 43.2492 22.666 43.1083C22.2504 42.7833 21.4666 42.7833 21.0983 43.4334L19.4381 46.3112C19.0225 47.0545 19.2529 47.2864 19.6685 47.7046C20.5923 48.5866 24.0054 51.3257 29.8194 51.3257C36.3248 51.3257 40.4312 46.9158 40.4312 42.131C40.4312 36.1413 35.2631 33.4476 30.7885 31.636C27.0502 30.1039 25.3448 28.6173 25.3448 26.4351C25.3448 24.9485 26.7746 23.1845 29.406 23.1845C32.0374 23.1845 35.4505 25.5054 35.8187 25.7394C36.3721 26.11 37.0655 25.7394 37.4337 25.1825L39.1866 22.5366C39.5096 22.0728 39.3718 21.284 38.9088 21.0045C37.985 20.3088 34.3867 17.8926 29.6816 17.8926C22.3451 17.8926 19.3003 22.6752 19.3003 26.8078L19.2981 26.8121Z' fill={SOL_TEAL} />
      <path d='M103.091 45.3344H91.3252V19.2843C91.3252 18.8206 90.9096 18.4023 90.4488 18.4023H86.2045C85.6964 18.4023 85.3281 18.8206 85.3281 19.2843V50.0239C85.3281 50.4876 85.6964 50.9059 86.2045 50.9059H103.091C103.599 50.9059 103.968 50.4876 103.968 50.0239V46.2164C103.968 45.7526 103.599 45.3344 103.091 45.3344Z' fill={SOL_TEAL} />
      <path d='M77.1263 41.5015L71.7342 39.0115C69.4948 43.8376 63.8637 46.2755 58.7689 44.479C53.3424 42.5677 50.4612 36.5389 52.3605 31.0802C53.9798 26.4275 58.588 23.5735 63.2737 24.0134L64.2276 18.1017C56.7081 17.1612 49.3802 21.5885 46.7639 29.1082C43.747 37.7742 48.1959 47.0795 56.8093 50.1133C64.9146 52.9695 73.6163 49.1837 77.1263 41.5036V41.5015Z' fill={SOL_TEAL} />
    </svg>
  );
}

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
                  <SolLogoInline />
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
                  If this keeps happening, please visit{' '}
                  <a href='https://solmentalhealth.com/contact' style={{ color: SOL_TEAL, textDecoration: 'none', fontWeight: 500 }}>
                    solmentalhealth.com/contact
                  </a>{' '}
                  for help.
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
                  If this keeps happening, please visit{' '}
                  <a href='https://solmentalhealth.com/contact' className='font-medium text-primary hover:underline'>
                    solmentalhealth.com/contact
                  </a>{' '}
                  for help.
                </p>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
