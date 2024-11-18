import { FC } from 'react';
import { FilterOverlayContainer } from './FilterOverlayContainer';
import { FilterOverlay } from './FilterOverlay';
import { usePreferences } from '@/PreferencesProvider';
import { FilterList } from './FilterList';

const ProviderFilter: FC = () => {
  const { filters } = usePreferences();

  return (
    <div className='mb-2'>
      <FilterOverlay>
        <FilterOverlayContainer />
      </FilterOverlay>
      <div className='flex flex-wrap'>
        <FilterList filters={filters} />
      </div>
    </div>
  );
};
ProviderFilter.displayName = 'ProviderFilter';

export { ProviderFilter };
