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
        'btn btn-sm hover:bg-secondary hover:border-1 hover:border-primary m-1',
        {
          'text-slate-800 border-1 border-slate-200  bg-white': !isActive,
          'border-1 border-primary ring-4 ring-secondary text-primary': isActive
        }
      )}
      onClick={(e) => {
        e.preventDefault();
        setActiveFilter(filter.key);
      }}
    >
      {label}
      {isActive && (
        <>
          <span
            className={clsx({
              'truncate max-w-[250px]': filter.selectType === 'multi'
            })}
          >
            {displaySelectedValues<T>(filter)}
          </span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='inline-block h-4 w-4 stroke-current cursor-pointer ml-2 -mr-2'
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
