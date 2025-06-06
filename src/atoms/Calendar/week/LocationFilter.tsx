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
    <div className='sol-flex sol-flex-col sol-gap-2 sol-mb-4'>
      <div className='sol-flex sol-items-center sol-gap-4'>
        {/* In-person section */}
        {hasInPerson && (
          <div className='sol-flex sol-flex-col sol-gap-2 sol-items-center sol-self-start sm:sol-self-auto'>
            <p className='sol-text-sm sol-font-medium sol-text-slate-500'>
              In Person
            </p>
            <div className='sol-flex sol-flex-col sm:sol-flex-row sm:sol-gap-2 sol-gap-1'>
              {inPersonOptions.map((option) => (
                <button
                  key={option}
                  className={clsx(
                    'sol-btn sol-btn-sm hover:sol-bg-secondary hover:sol-border-1 hover:sol-border-primary',
                    {
                      'sol-text-slate-800 sol-border-1 sol-border-slate-200 sol-bg-white':
                        option !== selected,
                      'sol-border-1 sol-border-primary sol-ring-4 sol-ring-secondary sol-text-primary sol-selected':
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
          <div className='sm:sol-h-16 sol-h-20 sol-w-px sol-bg-slate-300' />
        )}

        {/* Telehealth section */}
        {hasTelehealth && (
          <div className='sol-flex sol-flex-col sol-gap-2 sol-items-center sol-self-start sm:sol-self-auto'>
            <p className='sol-text-sm sol-font-medium sol-text-slate-500'>
              Virtual
            </p>
            <button
              className={clsx(
                'sol-btn sol-btn-sm hover:sol-bg-secondary hover:sol-border-1 hover:sol-border-primary',
                {
                  'sol-text-slate-800 sol-border-1 sol-border-slate-200 sol-bg-white':
                    'Telehealth' !== selected,
                  'sol-border-1 sol-border-primary sol-ring-4 sol-ring-secondary sol-text-primary sol-selected':
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
