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
      setActiveFilter(null);
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
        'sol-btn sol-btn-sm sol-text-sm sol-border-1 sol-border-primary sol-font-medium hover:sol-bg-secondary hover:sol-border-1 hover:sol-border-primary',
        {
          'sol-border-1 sol-border-primary sol-ring-4 sol-ring-secondary sol-bg-white sol-text-primary':
            filter.selectedOptions.includes(value),
          'sol-text-slate-800 sol-border-1 sol-border-slate-200 sol-bg-white':
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
