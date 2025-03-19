import { FC } from 'react';
import { DeliveryMethod, type SlotType } from '../../lib/api';
import { AvailabilitySlot } from './AvailabilitySlot';

export interface AvailabilitySlotsProps {
  timeZone: string;
  slots: Array<SlotType>;
  deliveryMethod?: DeliveryMethod;
}

export const AvailabilitySlots: FC<AvailabilitySlotsProps> = ({
  timeZone,
  slots,
  deliveryMethod
}) => {
  const label =
    slots.length > 0
      ? 'Next Availability:'
      : `${deliveryMethod ? `No ${deliveryMethod} slots available` : ''}`;
  return (
    <div className='sm:sol-min-w-[400px] sol-mt-4'>
      <div className='sol-mb-2 sol-text-sm sol-font-medium sol-text-slate-600'>
        {label}
      </div>
      <div className='sol-flex sol-flex-row sol-gap-2'>
        {slots.map((slot) => (
          <AvailabilitySlot
            key={slot.eventId}
            timeZone={timeZone}
            slotstart={new Date(slot.slotstart)}
          />
        ))}
      </div>
    </div>
  );
};
