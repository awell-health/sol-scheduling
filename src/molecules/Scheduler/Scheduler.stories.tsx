import type { Meta, StoryObj } from "@storybook/react";
import { Scheduler as SchedulerComponent } from "./Scheduler";
import { ThemeProvider } from "@awell-health/ui-library";
import { fn } from "@storybook/test";
import { useState } from "react";

const meta: Meta<typeof SchedulerComponent> = {
  title: "Molecules/Scheduler",
  component: SchedulerComponent,
  args: { onDateSelect: fn(), onSlotSelect: fn() },
  decorators: [
    (Story, context) => {
      const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

      const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        context.args.onDateSelect(date); // Trigger the action in Storybook
      };

      return <ThemeProvider accentColor="#004ac2">
                  <Story {...context} args={{ ...context.args, onDateSelect: handleDateSelect, date: selectedDate }} />

      </ThemeProvider>
    }
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Scheduler: Story = {
  args: {
    appointmentName: "Initial Consultation",
    appointmentLength: 60,
    appointmentCallType: "Video Call",
    availableSlots: [
      new Date("2024-07-12 00:00:00 +0200"),
      new Date("2024-07-12 00:15:00 +0200"),
      new Date("2024-07-12 00:30:00 +0200"),
      new Date("2024-07-12 00:45:00 +0200"),
      new Date("2024-07-12 01:00:00 +0200"),
      new Date("2024-07-12 01:15:00 +0200"),
      new Date("2024-07-12 01:30:00 +0200"),
    ],
  },
};
