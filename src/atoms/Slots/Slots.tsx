import { FC } from 'react';
import classes from './Slots.module.scss';
import { Field, Radio, RadioGroup } from '@headlessui/react';
import { isEmpty } from 'lodash';
import { CircularSpinner } from '@awell-health/ui-library';

export interface SlotsProps {
  value?: Date;
  slotDate?: Date;
  slots?: Date[];
  timeZone: string;
  onSelect: (date: Date) => void;
  loading?: boolean;
  orientation?: 'vertical' | 'horizontal';
  text?: {
    slotsLabel?: string;
    selectDateLabel?: string;
    noSlotsLabel?: string;
  };
}

export const Slots: FC<SlotsProps> = ({
  value = undefined,
  slotDate,
  slots,
  timeZone,
  orientation = 'horizontal',
  loading,
  onSelect,
  text
}) => {
  const {
    slotsLabel = 'Slots',
    selectDateLabel = 'Select a date first',
    noSlotsLabel = 'No slots available'
  } = text || {};

  const formatSlotTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone
    };

    // Always format in US format (12h notation + AM/PM)
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const handleSlotSelect = (date: Date) => {
    onSelect(date);
  };

  return (
    <div>
      {loading && (
        <div className={classes.loading}>
          <CircularSpinner size='sm' />
        </div>
      )}
      {!loading && slotDate && isEmpty(slots) && <div>{noSlotsLabel}</div>}
      {!loading && slotDate && !isEmpty(slots) && (
        <fieldset className={classes.fieldset} aria-label='Appointment type'>
          <RadioGroup
            value={value}
            onChange={handleSlotSelect}
            className={`${classes.group} ${classes[orientation]}`}
          >
            {slots?.map((slot) => (
              <Field key={slot.toISOString()}>
                <Radio
                  key={slot.toISOString()}
                  value={slot}
                  aria-label={slot.toISOString()}
                  className={classes.radio_option}
                >
                  {formatSlotTime(slot)}
                </Radio>
              </Field>
            ))}
          </RadioGroup>
        </fieldset>
      )}
    </div>
  );
};
