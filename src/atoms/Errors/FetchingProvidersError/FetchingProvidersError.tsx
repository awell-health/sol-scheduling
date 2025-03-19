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
      className='sol-flex sol-justify-center sol-flex-row sol-items-center sol-gap-1 cursor-pointer group sol-my-4'
      onClick={onClick}
    >
      <p
        className={clsx('sol-text-center sol-text-blue-500 group-hover:text-blue-700')}
      >
        Try again
      </p>
      <ArrowPathIcon
        className={clsx('sol-h-4 sol-w-4 fill-blue-500 group-hover:fill-blue-700')}
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
        <span className='sol-font-semibold'>{state}: </span>
        <a
          href={`tel:+${number}`}
          className='hover:sol-underline'
          onClick={() => copyToClipboard(number)}
        >
          {number}
          {`${number === PhoneNumbers.NY ? ' (option 1)' : ''}`}
        </a>
        {copied === number && (
          <span className='sol-text-green-500 sol-ml-1'>Copied to clipboard</span>
        )}
      </>
    );
  };

  return (
    <div className='sol-p-3'>
      <ul className='list-disc list-inside sol-space-y-1'>
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
    <div className={clsx('card bg-base-100 sol-shadow-md sol-p-6')}>
      <p className={clsx('sol-font-medium sol-text-xl sol-text-center sol-m-0')}>
        {FetchingProvidersError}
      </p>
      <RetryButton onClick={refetchFn} />
      <p className={clsx('sol-text-center')}>{FetchingProviderErrorMessage} </p>
      <ContactNumbers />
    </div>
  );
};
