import { usePreferences } from '@/PreferencesProvider';
import clsx from 'clsx';
import { FC } from 'react';

interface OptionProps {
  value: string;
  label: string | number;
}

export const FilterOverlayBadge: FC<OptionProps> = ({ value, label }) => {
  const { getActiveFilter, updateFilter, setActiveFilter } = usePreferences();
  const filter = getActiveFilter();
  const onSelectOption = (value: string) => {
    if (filter.selectType === 'single') {
      if (filter.selectedOptions[0] === value) {
        updateFilter({
          ...filter,
          selectedOptions: []
        });
      } else {
        updateFilter({
          ...filter,
          selectedOptions: [value]
        });
      }
      if (filter.key === 'location' && value && value.length > 2) {
        setActiveFilter(null);
      }
    } else {
      updateFilter({
        ...filter,
        selectedOptions: filter.selectedOptions.includes(value)
          ? filter.selectedOptions.filter((v) => v !== value)
          : [...filter.selectedOptions, value]
      });
    }
  };
  return (
    <button
      key={value}
      className={clsx(
        'btn btn-sm text-sm border-1 border-primary font-medium hover:bg-secondary hover:text-secondary-content hover:border-primary',
        {
          'bg-primary text-primary-content':
            filter.selectedOptions.includes(value),
          'bg-primary-content text-primary':
            !filter.selectedOptions.includes(value)
        }
      )}
      onClick={(e) => {
        e.preventDefault();
        onSelectOption(value);
      }}
    >
      {label}
    </button>
  );
};
