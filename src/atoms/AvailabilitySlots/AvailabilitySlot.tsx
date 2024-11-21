import { FC } from 'react';

export interface AvailabilitySlotProps {
  timeZone: string;
  slotstart: Date;
}

export const AvailabilitySlot: FC<AvailabilitySlotProps> = ({
  timeZone,
  slotstart
}) => {
  const formatSlotTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div className='rounded-md px-3 py-2 text-xs font-medium text-slate-800 border-1 border-slate-300 bg-white'>
      {formatSlotTime(slotstart)}
    </div>
  );
};
