import { FC } from 'react';
import clsx from 'clsx';
import classes from './ProviderFilter.module.scss';
import { FilterOverlayContainer } from './FilterOverlayContainer';
import { FilterOverlay } from './FilterOverlay';
import { usePreferences } from '@/PreferencesProvider';
import { FilterList } from './FilterList';

const ProviderFilter: FC = () => {
  const { filters } = usePreferences();

  return (
    <div className='overflow-x-hidden mb-2'>
      <FilterOverlay>
        <FilterOverlayContainer />
      </FilterOverlay>
      <div
        className={clsx(
          'overflow-x-auto flex gap-2 whitespace-nowrap scroll z-10 md:flex-wrap',
          classes['scrollable-container']
        )}
      >
        <FilterList filters={filters} />
      </div>
    </div>
  );
};
ProviderFilter.displayName = 'ProviderFilter';

export { ProviderFilter };
