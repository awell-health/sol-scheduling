import { FC } from 'react';
import clsx from 'clsx';

export interface Props {
  options: Array<string>;
  selected: string;
  onSelect: (location: string) => void;
}

export const LocationFilter: FC<Props> = (props) => {
  const { options, selected, onSelect } = props;
  const hasTelehealth = options.includes('Telehealth');
  const inPersonOptions = options.filter((opt) => opt !== 'Telehealth');
  const hasInPerson = inPersonOptions.length > 0;

  return (
    <div className='flex flex-col gap-2 mb-4'>
      <div className='flex items-center gap-4'>
        {/* In-person section */}
        {hasInPerson && (
          <div className='flex flex-col gap-2 items-center self-start sm:self-auto'>
            <p className='text-sm font-medium text-slate-500'>In Person</p>
            <div className='flex flex-col sm:flex-row sm:gap-2 gap-1'>
              {inPersonOptions.map((option) => (
                <button
                  key={option}
                  className={clsx(
                    'btn btn-sm hover:bg-secondary hover:border-1 hover:border-primary',
                    {
                      'text-slate-800 border-1 border-slate-200 bg-white':
                        option !== selected,
                      'border-1 border-primary ring-4 ring-secondary text-primary selected':
                        option === selected
                    }
                  )}
                  onClick={() => onSelect(option)}
                >
                  {option.slice(5)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Divider when both types are present */}
        {hasInPerson && hasTelehealth && (
          <div className='sm:h-16 h-20 w-px bg-slate-300' />
        )}

        {/* Telehealth section */}
        {hasTelehealth && (
          <div className='flex flex-col gap-2 items-center self-start sm:self-auto'>
            <p className='text-sm font-medium text-slate-500'>Virtual</p>
            <button
              className={clsx(
                'btn btn-sm hover:bg-secondary hover:border-1 hover:border-primary',
                {
                  'text-slate-800 border-1 border-slate-200 bg-white':
                    'Telehealth' !== selected,
                  'border-1 border-primary ring-4 ring-secondary text-primary selected':
                    'Telehealth' === selected
                }
              )}
              onClick={() => onSelect('Telehealth')}
            >
              Telehealth
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
