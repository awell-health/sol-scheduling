import type { Meta, StoryObj } from "@storybook/react";
import { Calendar as CalendarComponent } from "./Calendar";
import { ThemeProvider } from "@awell-health/ui-library";
import { fn } from "@storybook/test";
import { addDays } from "date-fns";

const meta: Meta<typeof CalendarComponent> = {
  title: "Atoms/Calendar",
  component: CalendarComponent,
  args: { onSelect: fn() },
  decorators: [
    (Story) => (
      <ThemeProvider accentColor="#A45128">
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Calendar: Story = {
  args: {
    loading: false,
    weekStartsOn: "sunday",
    availableDates: [
      addDays(new Date(), -1),
      addDays(new Date(), 7),
      addDays(new Date(), 14),
      addDays(new Date(), 21),
      addDays(new Date(), 28),
      addDays(new Date(), 31),
      addDays(new Date(), 40),
    ],
  },
};
