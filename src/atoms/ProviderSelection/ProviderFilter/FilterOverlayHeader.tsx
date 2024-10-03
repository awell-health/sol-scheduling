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
    <div className={'flex justify-between items-center mb-2 mx-4'}>
      <input
        type='text'
        placeholder={`Filter by ${filter.label}`}
        className='input w-48 md:w-72 h-8 text-sm focus:outline-0 rounded-md focus:border-primary focus:border-1'
        onChange={(e) => onChange(e.target.value)}
        ref={inputRef}
      />
      <button
        aria-label='Close filter'
        className='btn border-0 btn-circle shadow-none'
        onClick={() => setActiveFilter(null)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
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
