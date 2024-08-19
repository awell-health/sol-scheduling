import { FC, useMemo } from 'react';
import classes from './Scheduler.module.scss';
import { Slots, WeekCalendar } from '../../atoms';
import { DEFAULT_PROFILE_IMAGE } from '../../lib/constants';
import { isSameDay } from 'date-fns';
import { Button } from '@awell-health/ui-library';
import { type SlotType } from '../../lib/api';

export type SchedulerProps = {
  provider: {
    name: string;
    profileImageUrl?: string;
  };
  timeZone: string;
  date?: Date;
  slot?: SlotType;
  availabilities: SlotType[];
  loadingAvailabilities?: boolean;
  onDateSelect: (date: Date) => void;
  onSlotSelect: (slot: SlotType) => void;
  onBooking: (slot: SlotType) => void;
  opts?: {
    allowSchedulingInThePast?: boolean;
  };
  text?: {
    title?: string;
    selectSlot?: string;
    button?: string;
  };
};

export const Scheduler: FC<SchedulerProps> = ({
  date,
  slot,
  timeZone,
  provider,
  availabilities,
  loadingAvailabilities,
  onDateSelect,
  onSlotSelect,
  onBooking,
  opts,
  text
}) => {
  const {
    title = 'Schedule an appointment with',
    selectSlot = 'Select a time slot',
    button = 'Confirm booking'
  } = text || {};

  const { allowSchedulingInThePast = false } = opts || {};

  const filteredSlots = useMemo(() => {
    return availabilities.filter((availableSlot) =>
      date ? isSameDay(availableSlot.slotstart, date) : false
    );
  }, [availabilities, date]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h4 className={classes.title}>
          {title}
          <br />
          <span>{provider.name}</span>
        </h4>
        <img
          alt={provider.name}
          src={provider.profileImageUrl ?? DEFAULT_PROFILE_IMAGE}
          className={classes.headshot}
        />
      </div>
      <div className={classes.calendar}>
        <WeekCalendar
          value={date}
          onSelect={onDateSelect}
          loading={loadingAvailabilities}
          availabilities={availabilities}
          allowSchedulingInThePast={allowSchedulingInThePast}
        />
      </div>
      {date && (
        <div className={classes.timeslots}>
          <div className={classes.heading}>
            <h3 className={`${classes.title} ${classes.center}`}>
              {selectSlot}
            </h3>
            <p className={classes.timeZone}>Times in {timeZone}</p>
          </div>
          <Slots
            value={slot}
            onSelect={onSlotSelect}
            slots={filteredSlots}
            timeZone={timeZone}
          />
        </div>
      )}
      {date && slot && (
        <div className={classes.confirm}>
          <Button fullWidth={true} onClick={() => onBooking(slot)}>
            {button}
          </Button>
        </div>
      )}
    </div>
  );
};
