import clsx from 'clsx';
import { FC, useRef } from 'react';
import { useClickAway } from 'react-use';
import { useProviderFilter } from './ProviderFilterContext';

interface FilterContainerProps {
  children: React.ReactNode;
}
const FilterOverlay: FC<FilterContainerProps> = ({ children }) => {
  const { activeFilter, setActiveFilter } = useProviderFilter();
  const isFiltered = activeFilter !== null;
  const ref = useRef(null);
  useClickAway(ref, (e) => {
    e.preventDefault();
    setActiveFilter(null);
  });
  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 transition-transform duration-500 ease-in-out z-40',
          {
            'bg-opacity-30 bg-black': isFiltered,
            'bg-opacity-0 hidden bg-transparent': !isFiltered
          }
        )}
      />
      <div
        ref={ref}
        className={`fixed top-0 left-0 w-full bg-slate-200 rounded-b-md text-slate-800 p-4 transition-transform duration-500 ease-in-out z-50 ${
          isFiltered ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className='mt-2'>{children}</div>
      </div>
    </>
  );
};

export { FilterOverlay };
