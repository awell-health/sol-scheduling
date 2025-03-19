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
          'sol-fixed inset-0 transition-transform duration-500 ease-in-out sol-z-40',
          {
            'bg-opacity-30 bg-black': isFiltered,
            'bg-opacity-0 hidden bg-transparent': !isFiltered
          }
        )}
      />
      <div
        ref={ref}
        className={clsx(
          'sol-fixed sol-top-0 sol-left-1/2 transform -translate-x-1/2 sol-max-w-[650px] sol-w-full sol-bg-slate-200 sol-rounded-b-md sol-text-slate-800 transition-transform duration-500 ease-in-out sol-z-50 sol-p-4',
          {
            'translate-y-0 p-4': isFiltered,
            '-translate-y-full p-0': !isFiltered,
            'overflow-y-auto max-h-screen': true
          }
        )}
      >
        {activeFilter !== null && <div className='sol-mt-2'>{children}</div>}
      </div>
    </>
  );
};

export { FilterOverlay };
