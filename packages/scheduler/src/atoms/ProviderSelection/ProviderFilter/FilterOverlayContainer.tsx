import { FC, useState } from 'react';
import clsx from 'clsx';
import { usePreferences } from '@/PreferencesProvider';
import { optionsForFacility } from '../types';
import { FilterOverlayHeader } from './FilterOverlayHeader';
import { FilterOverlayBadge } from './FilterOverlayBadge';
import { LocationState } from '@/lib/api';

interface Props {
  className?: string;
}

const FilterOverlayContainer: FC<Props> = (props) => {
  const { className } = props;
  const { getActiveFilter, filters } = usePreferences();
  const filter = getActiveFilter();
  if (filter.key === 'facility') {
    const state = filters.find((f) => f.key === 'state')?.selectedOptions[0] as
      | LocationState
      | undefined;
    filter.options = optionsForFacility(state);
  }
  const [textFilteredOptions, setTextFilteredOptions] = useState<
    (typeof filter)['options']
  >(filter.options);

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
      <div
        className={clsx(
          'sol-flex sol-w-full sol-gap-2 sol-px-4 sol-flex-wrap sol-z-20',
          className
        )}
      >
        {textFilteredOptions.map(({ label, value }) => (
          <FilterOverlayBadge key={value} label={label} value={value} />
        ))}
      </div>
    </>
  );
};

export { FilterOverlayContainer };
