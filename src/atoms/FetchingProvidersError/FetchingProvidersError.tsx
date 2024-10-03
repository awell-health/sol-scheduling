import { FC } from 'react';
import clsx from 'clsx';

export const FetchingProvidersError: FC = () => {
  const FetchingProvidersError =
    'Oops! We are having trouble loading the providers';
  const FetchingProviderErrorMessage =
    "Don't worry — our team will contact you shortly to arrange your appointment. You can also reach us directly at";

  return (
    <div className={clsx('card bg-base-100 shadow-md p-6')}>
      <p className={clsx('font-medium text-xl text-center m-0')}>
        {FetchingProvidersError}
      </p>
      <p className={clsx('text-center mt-4')}>
        {FetchingProviderErrorMessage}{' '}
        <span className={clsx('font-bold')}>720-619-2641</span>.
      </p>
    </div>
  );
};
