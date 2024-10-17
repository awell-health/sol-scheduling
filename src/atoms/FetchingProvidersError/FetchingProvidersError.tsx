import { FC, useState } from 'react';
import clsx from 'clsx';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

const enum PhoneNumbers {
  CO = '720-262-2644',
  DC = '240-384-3442',
  TX = '832-669-5280',
  NY = '929-777-0173'
}
interface FetchingProvidersErrorProps {
  refetchFn: () => void;
}
interface RetryButtonProps {
  onClick: () => void;
}

const RetryButton: FC<RetryButtonProps> = ({ onClick }) => {
  return (
    <div
      className='flex justify-center flex-row items-center gap-1 cursor-pointer group my-4'
      onClick={onClick}
    >
      <p
        className={clsx('text-center text-blue-500 group-hover:text-blue-700')}
      >
        Try again
      </p>
      <ArrowPathIcon
        className={clsx('h-4 w-4 fill-blue-500 group-hover:fill-blue-700')}
      />
    </div>
  );
};

const ContactNumbers: FC = (): JSX.Element => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (number: string) => {
    navigator.clipboard.writeText(number).then(() => {
      setCopied(number);
      setTimeout(() => setCopied(null), 3000); // Clear the copied state after 2sec
    });
  };

  const ContactNumber: FC<{ state: string; number: PhoneNumbers }> = ({
    state,
    number
  }) => {
    return (
      <>
        <span className='font-semibold'>{state}: </span>
        <a
          href={`tel:+${number}`}
          className='hover:underline'
          onClick={() => copyToClipboard(number)}
        >
          {number}
          {`${number === PhoneNumbers.NY ? ' (option 1)' : ''}`}
        </a>
        {copied === number && (
          <span className='text-green-500 ml-1'>Copied to clipboard</span>
        )}
      </>
    );
  };

  return (
    <div className='p-3'>
      <ul className='list-disc list-inside space-y-1'>
        <li>
          <ContactNumber state='Colorado' number={PhoneNumbers.CO} />
        </li>
        <li>
          <ContactNumber
            state='D.C./Virginia/Maryland'
            number={PhoneNumbers.DC}
          />
        </li>
        <li>
          <ContactNumber state='Texas' number={PhoneNumbers.TX} />
        </li>
        <li>
          <ContactNumber state='New York' number={PhoneNumbers.NY} />
        </li>
      </ul>
    </div>
  );
};

export const FetchingProvidersError: FC<FetchingProvidersErrorProps> = ({
  refetchFn
}) => {
  const FetchingProvidersError =
    'Oops! We are having trouble loading the providers';
  const FetchingProviderErrorMessage =
    "Don't worry — our team will contact you shortly to arrange your appointment. You can also reach us directly at the following numbers:";

  return (
    <div className={clsx('card bg-base-100 shadow-md p-6')}>
      <p className={clsx('font-medium text-xl text-center m-0')}>
        {FetchingProvidersError}
      </p>
      <RetryButton onClick={refetchFn} />
      <p className={clsx('text-center')}>{FetchingProviderErrorMessage} </p>
      <ContactNumbers />
    </div>
  );
};
