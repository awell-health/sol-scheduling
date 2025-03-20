import { FC } from 'react';
import moment from 'moment-timezone';

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
        className='sol-select sol-w-full sol-text-slate-800 sol-text-lg sol-leading-5 sol-border-1 sol-border-slate-300 sol-rounded-lg focus:sol-outline-slate-300'
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
