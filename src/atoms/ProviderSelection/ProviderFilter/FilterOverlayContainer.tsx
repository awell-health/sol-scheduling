import { FC, useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { usePreferences } from '@/PreferencesProvider';
import { FilterEnum, FilterOption } from '../types';
import { FilterOverlayHeader } from './FilterOverlayHeader';
import { FilterOverlayBadge } from './FilterOverlayBadge';
import { isEmpty } from 'lodash-es';
import { stateToFacilitiesMap } from '@/lib/utils/location';
import { LocationState } from '@/lib/api';

interface Props {
  className?: string;
}

const FilterOverlayContainer: FC<Props> = (props) => {
  const { className } = props;
  const { getActiveFilter } = usePreferences();
  const filter = getActiveFilter();

  const isLocationFilter = useMemo(() => {
    return filter.key === 'location';
  }, [filter]);

  const [textFilteredOptions, setTextFilteredOptions] = useState<
    (typeof filter)['options']
  >(filter.options);
  const [locationFilter, setLocationFilter] = useState<{
    states: FilterOption<FilterEnum>[];
    facilities: FilterOption<FilterEnum>[];
  }>({ states: [], facilities: [] });

  useEffect(() => {
    if (isLocationFilter) {
      const states = textFilteredOptions.filter(
        (option) => option.value.length === 2
      );
      const facilities = textFilteredOptions.filter(
        (option) => option.value.length > 2
      );
      if (
        !isEmpty(filter.selectedOptions[0]) &&
        filter.selectedOptions[0].length === 2
      ) {
        const state = filter.selectedOptions[0];
        const filteredFacilities = stateToFacilitiesMap[
          state as LocationState
        ].map((o) => ({ label: o, value: o }));
        setLocationFilter({ states, facilities: filteredFacilities });
      } else {
        setLocationFilter({ states, facilities });
      }
    } else {
      setLocationFilter({ states: [], facilities: [] });
    }
  }, [filter, textFilteredOptions]);

  const onTextFilteredOptionsChange = (value: string) => {
    const opts = filter.options.filter(
      (option) =>
        String(option.label).toLowerCase().includes(value.toLowerCase()) ||
        String(option.value).toLowerCase().includes(value.toLowerCase())
    );
    setTextFilteredOptions(opts);
  };

  return (
    <>
      <FilterOverlayHeader onChange={onTextFilteredOptionsChange} />
      {!isLocationFilter && (
        <div
          className={clsx('flex w-full gap-2 px-4 flex-wrap z-20', className)}
        >
          {textFilteredOptions.map(({ label, value }) => (
            <FilterOverlayBadge key={value} label={label} value={value} />
          ))}
        </div>
      )}

      {isLocationFilter && (
        <>
          <div className='w-full mt-2 mb-1 z-20 font-semibold text-md flex'>
            States
          </div>
          <div
            className={clsx('flex w-full gap-2 px-4 flex-wrap z-20', className)}
          >
            {locationFilter.states.map(({ label, value }) => (
              <FilterOverlayBadge key={value} label={label} value={value} />
            ))}
          </div>
          <div className='w-full mt-2 mb-1 z-20 font-semibold text-md flex'>
            Facilities
          </div>
          <div
            className={clsx('flex w-full gap-2 px-4 flex-wrap z-20', className)}
          >
            {locationFilter.facilities.map(({ label, value }) => (
              <FilterOverlayBadge key={value} label={label} value={value} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export { FilterOverlayContainer };
