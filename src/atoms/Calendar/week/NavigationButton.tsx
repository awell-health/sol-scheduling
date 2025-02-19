import { FC } from 'react';
import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export interface Props {
  direction: 'left' | 'right';
  onClick: () => void;
  isDisabled: boolean;
}

export const NavigationButton: FC<Props> = (props) => {
  const { direction, onClick, isDisabled } = props;
  const chevronClasses = clsx(
    'flex flex-none align-center justify-center',
    'text-primary size-8 font-bold'
  );

  return (
    <button
      onClick={onClick}
      className={clsx('btn sm:px-6 sm:py-2 px-3 py-1', {
        'btn-disabled opacity-50 cursor-not-allowed': isDisabled,
        'btn-secondary': !isDisabled
      })}
      disabled={isDisabled}
      aria-label={
        direction === 'left' ? 'Go to previous week' : 'Go to next week'
      }
    >
      {direction === 'left' ? (
        <ChevronLeftIcon className={chevronClasses} aria-hidden='true' />
      ) : (
        <ChevronRightIcon className={chevronClasses} aria-hidden='true' />
      )}
    </button>
  );
};
