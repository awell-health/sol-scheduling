import { FC, useRef } from 'react';
import clsx from 'clsx';
import classes from './ProviderFilter.module.scss';
import { FilterBadge } from './FilterBadge';
import { FilterSelector } from './FilterSelector';
import { FilterOverlay } from './FilterOverlay';
import { usePreferences } from '@/PreferencesProvider';

type FocusRef = HTMLInputElement & HTMLSelectElement;

const ProviderFilter: FC = () => {
  const { filters, activeFilter } = usePreferences();

  const focusRef = useRef<FocusRef>(null);

  return (
    <div className='overflow-x-hidden mb-2'>
      <FilterOverlay>
        {activeFilter !== null && <FilterSelector inputRef={focusRef} />}
      </FilterOverlay>
      <div
        className={clsx(
          'overflow-x-auto pb-2 flex gap-2 whitespace-nowrap scroll z-10 md:flex-wrap',
          classes['scrollable-container']
        )}
      >
        {filters.map((filter) => {
          return <FilterBadge key={filter.key} filter={filter} />;
        })}
      </div>
    </div>
  );
};
ProviderFilter.displayName = 'ProviderFilter';

export { ProviderFilter };
