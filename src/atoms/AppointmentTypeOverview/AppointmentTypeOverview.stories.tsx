import type { Meta, StoryObj } from "@storybook/react";
import { AppointmentTypeOverview as AppointmentTypeOverviewComponent } from "./AppointmentTypeOverview";
import { ThemeProvider } from "@awell-health/ui-library";

const meta: Meta<typeof AppointmentTypeOverviewComponent> = {
  title: "Atoms/AppointmentTypeOverview",
  component: AppointmentTypeOverviewComponent,
  decorators: [
    (Story) => (
      <ThemeProvider accentColor="#004ac2">
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AppointmentTypeOverview: Story = {
  args: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    bookedSlot: new Date(),
    name: "Intake appointment",
    length: 45,
    contactType: "Video call",
  },
};
