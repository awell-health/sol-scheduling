import { FC, useCallback, useState } from 'react';
import { Field, Radio, RadioGroup } from '@headlessui/react';
import { isEmpty } from 'lodash-es';
import { DeliveryMethod, type SlotType } from '../../lib/api';
import clsx from 'clsx';
import { SelectedSlot } from '@/lib/api/schema/shared.schema';
import { usePreferences } from '@/PreferencesProvider';

export interface SlotsProps {
  timeZone: string;
  onSelect: (slot: SelectedSlot) => void;
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
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const { noSlotsLabel = 'No slots available' } = text || {};
  const { bookingInformation } = usePreferences();

  const formatSlotTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const handleSlotSelect = useCallback(
    (eventId: string) => {
      const claimedSlot: SlotType = slots?.find(
        (_) => _.eventId === eventId
      ) as SlotType;

      const selectedSlot: SelectedSlot = {
        ...claimedSlot,
        locationType:
          bookingInformation.deliveryMethod ?? DeliveryMethod.Telehealth
      };
      setSelectedSlot(selectedSlot);
      onSelect(selectedSlot);
    },
    [onSelect, slots]
  );

  return (
    <div>
      {loading && (
        <div className='flex justify-center'>
          <span className='loading loading-infinity loading-lg text-primary'></span>
        </div>
      )}
      {!loading && isEmpty(slots) && <div>{noSlotsLabel}</div>}
      {!loading && !isEmpty(slots) && (
        <fieldset
          className={clsx('m-0 p-0 b-0 w-full overflow-visible')}
          aria-label='Appointment type'
        >
          <RadioGroup
            value={value?.eventId ?? ''}
            onChange={handleSlotSelect}
            className={clsx({
              'grid grid-cols-3 gap-3': orientation === 'horizontal',
              'flex flex-col gap-3': orientation === 'vertical'
            })}
          >
            {slots?.map((slot) => (
              <Field key={slot.eventId}>
                <Radio
                  key={slot.eventId}
                  value={slot.eventId}
                  aria-label={slot.slotstart.toISOString()}
                  className={clsx(
                    'relative block cursor-pointer rounded-md px-3 py-4 text-center outline-0 font-medium hover:bg-secondary hover:border-1 hover:border-primary',
                    {
                      'text-slate-800 border-1 border-slate-200  bg-white':
                        selectedSlot?.eventId !== slot.eventId,
                      'border-1 border-primary ring-4 ring-secondary text-primary':
                        selectedSlot?.eventId === slot.eventId
                    }
                  )}
                >
                  {formatSlotTime(slot.slotstart)}
                </Radio>
              </Field>
            ))}
          </RadioGroup>
        </fieldset>
      )}
    </div>
  );
};
