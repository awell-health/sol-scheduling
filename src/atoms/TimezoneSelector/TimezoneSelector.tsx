import { FC } from 'react';
import moment from 'moment-timezone';
import classes from './TimezoneSelector.module.scss';

interface TimezoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
}

export const TimezoneSelector: FC<TimezoneSelectorProps> = ({
  value,
  onChange
}) => {
  const handleTimezoneChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newTimezone = event.target.value;
    onChange(newTimezone);
  };

  return (
    <div>
      <label htmlFor='timezone-select'>Timezone:</label>
      <select
        id='timezone-select'
        value={value}
        onChange={handleTimezoneChange}
        className={classes.select_input}
      >
        {moment.tz.names().map((timezone) => (
          <option key={timezone} value={timezone}>
            {timezone}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimezoneSelector;
