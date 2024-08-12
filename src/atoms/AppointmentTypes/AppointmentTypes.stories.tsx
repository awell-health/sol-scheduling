import type { Meta, StoryObj } from '@storybook/react';
import { AppointmentTypes as AppointmentTypesComponent } from './AppointmentTypes';
import { ThemeProvider } from '@awell-health/ui-library';
import { fn } from '@storybook/test';

const meta: Meta<typeof AppointmentTypesComponent> = {
  title: 'Atoms/AppointmentTypes',
  component: AppointmentTypesComponent,
  args: { onSelect: fn() },
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

export const AppointmentTypes: Story = {
  args: {
    appointmentTypes: [
      {
        id: '54454',
        name: 'Initial Consultation',
        length: 60,
        disabled: false,
        availableContactTypes: ['Healthie Video Call', 'Phone Call']
      },
      {
        id: '54455',
        name: 'Follow-up Session',
        length: 45,
        disabled: false,
        availableContactTypes: ['Healthie Video Call', 'Phone Call']
      },
      {
        id: '54456',
        name: 'Group Session',
        length: 45,
        disabled: true,
        availableContactTypes: ['Phone Call']
      },
      {
        id: '66891',
        name: 'Regular visit',
        length: 30,
        disabled: false,
        availableContactTypes: ['Healthie Video Call']
      }
    ]
  }
};
