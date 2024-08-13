import type { Meta, StoryObj } from '@storybook/react';
import { TimezoneSelector as TimezoneSelectorComponent } from './TimezoneSelector';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';
import { useState } from 'react';

const meta: Meta<typeof TimezoneSelectorComponent> = {
  title: 'Atoms/TimezoneSelector',
  component: TimezoneSelectorComponent,
  args: { onChange: fn() },
  decorators: [
    (Story) => (
      <ThemeProvider accentColor='#A45128'>
        <Story />
      </ThemeProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TimezoneSelector: Story = {
  render: (args) => {
    const [timezone, setTimezone] = useState(
      args.value || Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    const handleTimezoneChange = (newTimezone: string) => {
      setTimezone(newTimezone);
      args.onChange(newTimezone);
    };

    return (
      <TimezoneSelectorComponent
        {...args}
        value={timezone}
        onChange={handleTimezoneChange}
      />
    );
  },
  args: {
    value: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
};
