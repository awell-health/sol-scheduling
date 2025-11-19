'use client';

type ProvidersEmptyStateProps = {
  onReset?: () => void;
};

export function ProvidersEmptyState({ onReset }: ProvidersEmptyStateProps) {
  return (
    <div className='rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center'>
      <p className='text-base font-semibold text-slate-900'>
        No providers match these filters
      </p>
      <p className='mt-2 text-sm text-slate-600'>
        Try broadening your search to see more availability.
      </p>
      {onReset && (
        <button
          type='button'
          onClick={onReset}
          className='mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50'
        >
          Reset filters
        </button>
      )}
    </div>
  );
}


