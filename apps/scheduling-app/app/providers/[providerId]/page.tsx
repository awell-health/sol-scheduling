import { ProviderDetailPage } from './ProviderDetailPage';

export default async function ProviderDetailRoute({
  params
}: {
  params: Promise<{ providerId: string }>;
}) {
  const { providerId } = await params;
  return (
    <main className='min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl'>
        <ProviderDetailPage providerId={providerId} />
      </div>
    </main>
  );
}


