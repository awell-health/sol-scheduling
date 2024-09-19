import clsx from 'clsx';
import { FC, useEffect, useRef } from 'react';
import { useClickAway } from 'react-use';
import { usePreferences } from '@/PreferencesProvider';

interface FilterContainerProps {
  children: React.ReactNode;
}
const FilterOverlay: FC<FilterContainerProps> = ({ children }) => {
  const { activeFilter, setActiveFilter } = usePreferences();
  const isFiltered = activeFilter !== null;
  const ref = useRef(null);
  useClickAway(ref, () => {
    setActiveFilter(null);
  });

  // icky, but idk a better way to remove the scrollbar using the virtual dom
  useEffect(() => {
    if (isFiltered) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isFiltered]);

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
        className={clsx(
          'fixed top-0 left-1/2 transform -translate-x-1/2 max-w-[650px] w-full bg-slate-200 rounded-b-md text-slate-800 transition-transform duration-500 ease-in-out z-50 p-4',
          {
            'translate-y-0 p-4': isFiltered,
            '-translate-y-full p-0': !isFiltered,
            'overflow-y-auto max-h-screen': true
          }
        )}
      >
        {activeFilter !== null && <div className='mt-2'>{children}</div>}
      </div>
    </>
  );
};

export { FilterOverlay };
