import { FC, useCallback } from 'react';
import classes from './Slots.module.scss';
import { Field, Radio, RadioGroup } from '@headlessui/react';
import { isEmpty } from 'lodash';
import { CircularSpinner } from '@awell-health/ui-library';
import { GetAvailabilitiesResponseType } from '../../lib/api';

export type SlotType = Pick<
  GetAvailabilitiesResponseType['data'][0],
  'startDate' | 'eventId' | 'duration' | 'providerId'
>;

export interface SlotsProps {
  value?: SlotType;
  slots?: SlotType[];
  timeZone: string;
  onSelect: (slot: SlotType) => void;
  loading?: boolean;
  orientation?: 'vertical' | 'horizontal';
  text?: {
    noSlotsLabel?: string;
  };
}

export const Slots: FC<SlotsProps> = ({
  value = undefined,
  slots,
  timeZone,
  orientation = 'horizontal',
  loading,
  onSelect,
  text
}) => {
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

  const handleSlotSelect = useCallback(
    (eventId: string) => {
      const selectedSlot = slots?.find(
        (_) => _.eventId === eventId
      ) as SlotType;

      onSelect(selectedSlot);
    },
    [onSelect]
  );

  return (
    <div>
      {loading && (
        <div className={classes.loading}>
          <CircularSpinner size='sm' />
        </div>
      )}
      {!loading && isEmpty(slots) && <div>{noSlotsLabel}</div>}
      {!loading && !isEmpty(slots) && (
        <fieldset className={classes.fieldset} aria-label='Appointment type'>
          <RadioGroup
            value={value?.eventId}
            onChange={handleSlotSelect}
            className={`${classes.group} ${classes[orientation]}`}
          >
            {slots?.map((slot) => (
              <Field key={slot.eventId}>
                <Radio
                  key={slot.eventId}
                  value={slot.eventId}
                  aria-label={slot.startDate.toISOString()}
                  className={classes.radio_option}
                >
                  {formatSlotTime(slot.startDate)}
                </Radio>
              </Field>
            ))}
          </RadioGroup>
        </fieldset>
      )}
    </div>
  );
};
