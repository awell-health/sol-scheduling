'use client';

import { useRouter } from 'next/navigation';
import { clearSolPreferenceStorage } from '../providers/_lib/preferences';

export function StartOverButton() {
  const router = useRouter();

  const handleClick = () => {
    clearSolPreferenceStorage();
    router.push('/providers');
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className='inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto'
    >
      Start over
    </button>
  );
}


