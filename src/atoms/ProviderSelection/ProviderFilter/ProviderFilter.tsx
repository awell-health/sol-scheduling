import { FC } from 'react';
import { FilterOverlayContainer } from './FilterOverlayContainer';
import { FilterOverlay } from './FilterOverlay';
import { usePreferences } from '@/PreferencesProvider';
import { FilterList } from './FilterList';

const ProviderFilter: FC = () => {
  const { filters } = usePreferences();

  return (
    <div className='sol-mb-2'>
      <FilterOverlay>
        <FilterOverlayContainer />
      </FilterOverlay>
      <div className='sol-flex sol-flex-wrap'>
        <FilterList filters={filters} />
      </div>
    </div>
  );
};
ProviderFilter.displayName = 'ProviderFilter';

export { ProviderFilter };
