import { FC, useCallback, useState } from 'react';
import { Field, Radio, RadioGroup } from '@headlessui/react';
import { isEmpty } from 'lodash-es';
import { type SlotType } from '../../lib/api';
import clsx from 'clsx';
import videoChatIcon from '@/assets/video-chat-icon.svg';

export interface SlotsProps {
  timeZone: string;
  onSelect: (slot: SlotType) => void;
  value: SlotType | null;
  slots?: SlotType[];
  loading?: boolean;
  orientation?: 'vertical' | 'horizontal';
  text?: {
    noSlotsLabel?: string;
  };
}

export const Slots: FC<SlotsProps> = ({
  timeZone,
  onSelect,
  value,
  slots,
  orientation = 'horizontal',
  loading,
  text
}) => {
  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null);
  const { noSlotsLabel = 'No slots available' } = text || {};

  const formatSlotTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const formatFacility = (facility: string) => {
    if (facility.length > 5) {
      return facility.slice(5);
    }
    return facility;
  };

  const handleSlotSelect = useCallback(
    (eventId: string) => {
      const slot: SlotType = slots?.find(
        (_) => _.eventId === eventId
      ) as SlotType;

      setSelectedSlot(slot);
      onSelect(slot);
    },
    [onSelect, slots]
  );

  return (
    <div>
      {loading && (
        <div className='sol-flex sol-justify-center'>
          <span className='sol-loading sol-loading-infinity sol-loading-lg sol-text-primary'></span>
        </div>
      )}
      {!loading && isEmpty(slots) && <div>{noSlotsLabel}</div>}
      {!loading && !isEmpty(slots) && (
        <fieldset
          className={clsx(
            'sol-m-0 sol-p-0 b-0 sol-w-full sol-overflow-visible'
          )}
          aria-label='Appointment type'
        >
          <RadioGroup
            value={value?.eventId ?? ''}
            data-testid='slots'
            onChange={handleSlotSelect}
            className={clsx({
              'sol-grid sol-grid-cols-3 sol-gap-3':
                orientation === 'horizontal',
              'sol-flex sol-flex-col sol-gap-3': orientation === 'vertical'
            })}
          >
            {slots?.map((slot) => (
              <Field key={slot.eventId}>
                <Radio
                  key={slot.eventId}
                  value={slot.eventId}
                  aria-label={slot.slotstart.toISOString()}
                  className={clsx(
                    'sol-h-full sol-relative sol-block sol-cursor-pointer sol-rounded-md sol-text-center sol-outline-0 sol-font-medium hover:sol-bg-secondary hover:sol-border-1 hover:sol-border-primary',
                    {
                      'sol-text-slate-800 sol-border-1 sol-border-slate-200 sol-bg-white':
                        selectedSlot?.eventId !== slot.eventId,
                      'sol-border-1 sol-border-primary sol-ring-4 sol-ring-secondary sol-text-primary':
                        selectedSlot?.eventId === slot.eventId
                    }
                  )}
                >
                  <div className='sol-flex sol-items-center sol-justify-center sol-gap-2 sm:sol-px-3 sol-py-2 sm:sol-py-4 sm:sol-h-17'>
                    <div className='sol-flex sol-flex-col sol-items-center sol-p-1 sol-gap-1'>
                      <div className='sol-flex sol-gap-1 sol-items-center'>
                        <div className='sol-text-center sol-text-md'>
                          {formatSlotTime(slot.slotstart)}
                        </div>
                        <div className='sol-flex sol-justify-end sm:sol-absolute sol-top-1 sol-right-1'>
                          {slot.location === 'Telehealth' && (
                            <img
                              src={videoChatIcon}
                              alt='Video Chat Icon'
                              className='sol-w-5 sol-h-5 sm:sol-w-7 sm:sol-h-7'
                            />
                          )}
                        </div>
                      </div>
                      <div className='sol-text-center sol-font-normal sol-text-xs sm:sol-text-sm sol-text-slate-500'>
                        {slot.location === 'Telehealth'
                          ? 'Virtual'
                          : formatFacility(slot.facility)}
                      </div>
                    </div>
                  </div>
                </Radio>
              </Field>
            ))}
          </RadioGroup>
        </fieldset>
      )}
    </div>
  );
};
