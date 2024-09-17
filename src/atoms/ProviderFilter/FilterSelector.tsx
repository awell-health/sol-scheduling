import { FC, useState } from 'react';
import clsx from 'clsx';
import { useProviderFilter } from './ProviderFilterContext';

interface Props {
  className?: string;
  inputRef: React.RefObject<HTMLInputElement>;
}

const FilterSelector: FC<Props> = (props) => {
  const { className, inputRef } = props;
  const { getActiveFilter, updateFilter, setActiveFilter } =
    useProviderFilter();
  const filter = getActiveFilter();

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

  const onSelectOption = (value: string) => {
    if (filter.selectType === 'single') {
      updateFilter({
        ...filter,
        selectedOptions: [value]
      });
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
    <>
      <div className={'flex justify-between items-center mb-2 mx-4'}>
        <input
          type='text'
          placeholder={`Filter by ${filter.label}`}
          className='input w-48 md:w-72 h-8 text-sm focus:outline-0 rounded-md focus:border-primary focus:border-1'
          onChange={(e) => onTextFilteredOptionsChange(e.target.value)}
          ref={inputRef}
        />
        <button
          className='btn border-0 btn-circle'
          onClick={() => setActiveFilter(null)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>
      <div className={clsx('flex w-full gap-2 px-4 flex-wrap z-20', className)}>
        {textFilteredOptions.map(({ value, label }) => {
          return (
            <div
              key={value}
              className={clsx(
                'badge badge-lg cursor-pointer border-primary border-1 font-normal',
                {
                  'bg-primary text-white font-md':
                    filter.selectedOptions.includes(value),
                  'bg-slate-100': !filter.selectedOptions.includes(value)
                }
              )}
              onClick={(e) => {
                e.preventDefault();
                onSelectOption(value);
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </>
  );
};

export { FilterSelector };
