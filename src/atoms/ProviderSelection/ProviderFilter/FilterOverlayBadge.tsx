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
        'btn btn-sm sol-text-sm sol-border-1 sol-border-primary sol-font-medium hover:sol-bg-secondary hover:sol-border-1 hover:sol-border-primary',
        {
          'border-1 border-primary ring-4 ring-secondary bg-white text-primary':
            filter.selectedOptions.includes(value),
          'text-slate-800 border-1 border-slate-200  bg-white':
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
