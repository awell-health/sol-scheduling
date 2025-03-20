import clsx from 'clsx';
import { usePreferences } from '@/PreferencesProvider';
import { displaySelectedValues } from './utils';
import { FilterType, FilterEnum } from '../types';

interface Props<T extends FilterEnum> {
  filter: FilterType<T>;
}

const FilterBadge = <T extends FilterEnum>({ filter }: Props<T>) => {
  const { setActiveFilter, updateFilter } = usePreferences();
  const isActive = filter.selectedOptions && filter.selectedOptions.length > 0;
  const label = `${filter.label}${isActive ? ': ' : ''}`;
  return (
    <button
      key={filter.key}
      className={clsx(
        'sol-btn sol-btn-sm hover:sol-bg-secondary hover:sol-border-1 hover:sol-border-primary sol-m-1',
        {
          'sol-text-slate-800 sol-border-1 sol-border-slate-200 sol-bg-white':
            !isActive,
          'sol-border-1 sol-border-primary sol-ring-4 sol-ring-secondary sol-text-primary':
            isActive
        }
      )}
      onClick={(e) => {
        e.preventDefault();
        setActiveFilter(filter.key);
      }}
    >
      {' '}
      {label}{' '}
      {isActive && (
        <>
          {' '}
          <span
            className={clsx({
              'sol-truncate sol-max-w-[180px]': filter.selectType === 'multi'
            })}
          >
            {displaySelectedValues<T>(filter)}
          </span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='sol-inline-block sol-h-4 sol-w-4 sol-stroke-current sol-cursor-pointer -sol-mr-2'
            aria-label={`Clear ${filter.label} filter`}
            onClick={(e) => {
              e.stopPropagation();
              const updatedFilter = {
                ...filter,
                selectedOptions: []
              } as unknown as FilterType<FilterEnum>;
              updateFilter(updatedFilter);
            }}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M6 18L18 6M6 6l12 12'
            ></path>
          </svg>
        </>
      )}
    </button>
  );
};

FilterBadge.displayName = 'FilterBadge';
export { FilterBadge };
