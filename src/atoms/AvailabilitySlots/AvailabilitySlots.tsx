import { FC } from 'react';
import { type SlotType } from '../../lib/api';
import { AvailabilitySlot } from './AvailabilitySlot';

export interface AvailabilitySlotsProps {
  timeZone: string;
  slots: Array<SlotType>;
}

export const AvailabilitySlots: FC<AvailabilitySlotsProps> = ({
  timeZone,
  slots
}) => {
  const slotsToMap = slots.slice(0, 3);
  return (
    <div>
      <div className='mb-2 text-sm font-medium text-slate-600'>
        Next availability:
      </div>
      <div className='flex flex-row gap-2'>
        {slotsToMap.map((slot) => (
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
