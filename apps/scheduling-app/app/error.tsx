'use client';

export default function Error({
  error,
  reset,
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
    <div className='flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4'>
      <h2 className='text-lg font-semibold'>Something went wrong</h2>
      <button
        onClick={() => reset()}
        className='rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800'
      >
        Try again
      </button>
    </div>
  );
}
