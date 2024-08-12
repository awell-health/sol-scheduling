import type { Meta, StoryObj } from "@storybook/react";
import { Slots as SlotsComponent } from "./Slots";
import { ThemeProvider } from "@awell-health/ui-library";
import { fn } from "@storybook/test";

const meta: Meta<typeof SlotsComponent> = {
  title: "Atoms/Slots",
  component: SlotsComponent,
  args: { onSelect: fn() },
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

export const Slots: Story = {
  args: {
    slotDate: new Date(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    slots: [
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
