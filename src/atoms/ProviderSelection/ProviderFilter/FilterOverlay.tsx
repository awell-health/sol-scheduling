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
      document.body.classList.add('sol-overflow-hidden');
    } else {
      document.body.classList.remove('sol-overflow-hidden');
    }

    return () => {
      document.body.classList.remove('sol-overflow-hidden');
    };
  }, [isFiltered]);

  return (
    <>
      <div
        className={clsx(
          'sol-fixed sol-inset-0 sol-transition-transform sol-duration-500 sol-ease-in-out sol-z-40',
          {
            'sol-bg-opacity-30 sol-bg-black': isFiltered,
            'sol-bg-opacity-0 sol-hidden sol-bg-transparent': !isFiltered
          }
        )}
      />
      <div
        ref={ref}
        className={clsx(
          'sol-fixed sol-top-0 sol-left-1/2 sol-transform -sol-translate-x-1/2 sol-max-w-[650px] sol-w-full sol-bg-slate-200 sol-rounded-b-md sol-text-slate-800 sol-transition-transform sol-duration-500 sol-ease-in-out sol-z-50 sol-p-4',
          {
            'sol-translate-y-0 sol-p-4': isFiltered,
            '-sol-translate-y-full sol-p-0': !isFiltered,
            'sol-overflow-y-auto sol-max-h-screen': true
          }
        )}
      >
        {activeFilter !== null && <div className='sol-mt-2'>{children}</div>}
      </div>
    </>
  );
};

export { FilterOverlay };
