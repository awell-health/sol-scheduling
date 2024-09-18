import clsx from 'clsx';
import { usePreferences } from '@/PreferencesProvider';
import { displaySelectedValues } from './utils';
import { FilterType, FilterEnum } from '../types';

interface Props<T extends FilterEnum> {
  filter: FilterType<T>;
}

const FilterBadge = <T extends FilterEnum>({
  filter
  // onSetFilter,
  // onUpdateSelectedOptions
}: Props<T>) => {
  const { setActiveFilter, updateFilter } = usePreferences();
  const isActive = filter.selectedOptions && filter.selectedOptions.length > 0;
  return (
    <div
      key={filter.key}
      className={clsx(
        'badge badge-lg text-sm border-0 relative py-4 px-4 cursor-pointer',
        {
          'bg-secondary text-slate-800 font-medium': isActive,
          'bg-slate-300 font-normal': !isActive
        }
      )}
      onClick={(e) => {
        e.preventDefault();
        setActiveFilter(filter.key);
      }}
    >
      {filter.label}
      {isActive && (
        <>
          <span>: {displaySelectedValues<T>(filter)}</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='inline-block h-4 w-4 stroke-current cursor-pointer ml-2 -mr-2'
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
    </div>
  );
};

FilterBadge.displayName = 'FilterBadge';
export { FilterBadge };
