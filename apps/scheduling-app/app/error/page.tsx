import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Something went wrong',
  description: 'We encountered an error. Please try again.',
};

export default function ErrorPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">
            Sorry, we&apos;re having trouble right now
          </h1>
          <p className="text-slate-600">
            Please try again later.
          </p>
        </div>
        
        <Link
          href="/providers"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary/90 transition"
        >
          Try again
        </Link>
      </div>
    </div>
  );
}

