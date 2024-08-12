import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "./Button";
import { ThemeProvider } from "@awell-health/ui-library";

const meta: Meta<typeof Button> = {
  title: "Scheduling/Component",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: { control: "color" },
  },
  args: { onClick: fn() },
  decorators: [
    (Story) => (
      <ThemeProvider accentColor="#004ac2">
        <Story />
      </ThemeProvider>
    ),
  ]
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
};
