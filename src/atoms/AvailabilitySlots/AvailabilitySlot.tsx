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
  // TODO - check if border-1 is actually working
  return (
    <div className='sol-rounded-md sol-px-3 sol-py-2 sol-text-xs sol-font-medium sol-text-slate-800 sol-border-1 sol-border-slate-300 sol-bg-white'>
      {formatSlotTime(slotstart)}
    </div>
  );
};
