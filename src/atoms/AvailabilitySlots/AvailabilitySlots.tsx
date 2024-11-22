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
    <div className='sm:min-w-[400px] mt-4'>
      <div className='mb-2 text-sm font-medium text-slate-600'>{label}</div>
      <div className='flex flex-row gap-2'>
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
