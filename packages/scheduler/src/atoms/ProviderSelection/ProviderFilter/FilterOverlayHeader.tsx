import { usePreferences } from '@/PreferencesProvider';
import { FC, useEffect, useRef } from 'react';

interface Props {
  onChange: (value: string) => void;
}

export const FilterOverlayHeader: FC<Props> = ({ onChange }) => {
  const { getActiveFilter, setActiveFilter } = usePreferences();
  const filter = getActiveFilter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef !== null && inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <div className='sol-flex sol-justify-between sol-items-center sol-mb-2 sol-mx-4'>
      <input
        type='text'
        placeholder={`Filter by ${filter.label}`}
        className='sol-input sol-w-48 md:sol-w-72 sol-h-8 sol-text-base focus:sol-outline-0 sol-rounded-md focus:sol-border-primary focus:sol-border-1'
        onChange={(e) => onChange(e.target.value)}
        ref={inputRef}
      />
      <button
        aria-label='Close filter'
        className='sol-btn sol-border-0 sol-btn-circle sol-shadow-none'
        onClick={() => setActiveFilter(null)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='sol-h-6 sol-w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
    </div>
  );
};
