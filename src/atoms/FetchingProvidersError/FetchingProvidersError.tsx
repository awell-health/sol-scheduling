import { FC } from 'react';
import clsx from 'clsx';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

interface FetchingProvidersErrorProps {
  refetchFn: () => void;
}

export const FetchingProvidersError: FC<FetchingProvidersErrorProps> = ({
  refetchFn
}) => {
  const FetchingProvidersError =
    'Oops! We are having trouble loading the providers';
  const FetchingProviderErrorMessage =
    "Don't worry — our team will contact you shortly to arrange your appointment. You can also reach us directly at";

  return (
    <div className={clsx('card bg-base-100 shadow-md p-6')}>
      <p className={clsx('font-medium text-xl text-center m-0')}>
        {FetchingProvidersError}
      </p>
      <div
        className='flex justify-center flex-row items-center gap-1 cursor-pointer group my-4'
        onClick={refetchFn}
      >
        <p
          className={clsx(
            'text-center text-blue-500 group-hover:text-blue-700'
          )}
        >
          Try again
        </p>
        <ArrowPathIcon
          className={clsx('h-4 w-4 fill-blue-500 group-hover:fill-blue-700')}
        />
      </div>
      <p className={clsx('text-center')}>
        {FetchingProviderErrorMessage}{' '}
        <span className={clsx('font-bold')}>720-619-2641</span>.
      </p>
    </div>
  );
};
