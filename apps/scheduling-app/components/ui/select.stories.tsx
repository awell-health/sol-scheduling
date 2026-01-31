import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect } from 'storybook/test';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from './select';
import { Label } from './label';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='min-h-[300px]'>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof Select>;

// Default select
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className='w-[240px]'>
        <SelectValue placeholder='Select an option' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='option1'>Option 1</SelectItem>
        <SelectItem value='option2'>Option 2</SelectItem>
        <SelectItem value='option3'>Option 3</SelectItem>
      </SelectContent>
    </Select>
  )
};

// With default value
export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue='option2'>
      <SelectTrigger className='w-[240px]'>
        <SelectValue placeholder='Select an option' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='option1'>Option 1</SelectItem>
        <SelectItem value='option2'>Option 2</SelectItem>
        <SelectItem value='option3'>Option 3</SelectItem>
      </SelectContent>
    </Select>
  )
};

// With groups
export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className='w-[240px]'>
        <SelectValue placeholder='Select a fruit' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Citrus</SelectLabel>
          <SelectItem value='orange'>Orange</SelectItem>
          <SelectItem value='lemon'>Lemon</SelectItem>
          <SelectItem value='lime'>Lime</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Berries</SelectLabel>
          <SelectItem value='strawberry'>Strawberry</SelectItem>
          <SelectItem value='blueberry'>Blueberry</SelectItem>
          <SelectItem value='raspberry'>Raspberry</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
};

// Disabled state
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className='w-[240px]'>
        <SelectValue placeholder='Select is disabled' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='option1'>Option 1</SelectItem>
      </SelectContent>
    </Select>
  )
};

// With label
export const WithLabel: Story = {
  render: () => (
    <div className='flex flex-col gap-2'>
      <Label htmlFor='state-select'>State</Label>
      <Select>
        <SelectTrigger id='state-select' className='w-[240px]'>
          <SelectValue placeholder='Select your state' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='ca'>California</SelectItem>
          <SelectItem value='co'>Colorado</SelectItem>
          <SelectItem value='ny'>New York</SelectItem>
          <SelectItem value='tx'>Texas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
};

// Real-world example: Service type selector
export const ServiceTypeSelector: Story = {
  render: () => (
    <div className='flex flex-col gap-2'>
      <Label>What service are you looking for?</Label>
      <Select defaultValue='medication'>
        <SelectTrigger className='w-full max-w-sm'>
          <SelectValue placeholder='Select a service' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='medication'>Medication Management</SelectItem>
          <SelectItem value='therapy'>Therapy</SelectItem>
          <SelectItem value='both'>Both Medication & Therapy</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
};

// Real-world example: Insurance selector with groups
export const InsuranceSelector: Story = {
  render: () => (
    <div className='flex flex-col gap-2'>
      <Label>Insurance Provider</Label>
      <Select>
        <SelectTrigger className='w-full max-w-sm'>
          <SelectValue placeholder='Select your insurance' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Popular</SelectLabel>
            <SelectItem value='bcbs'>Blue Cross Blue Shield</SelectItem>
            <SelectItem value='aetna'>Aetna</SelectItem>
            <SelectItem value='cigna'>Cigna</SelectItem>
            <SelectItem value='united'>UnitedHealthcare</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Other</SelectLabel>
            <SelectItem value='humana'>Humana</SelectItem>
            <SelectItem value='kaiser'>Kaiser Permanente</SelectItem>
            <SelectItem value='anthem'>Anthem</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectItem value='self-pay'>Self Pay / No Insurance</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
};

// Full width
export const FullWidth: Story = {
  render: () => (
    <Select>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Full width select' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='option1'>Option 1</SelectItem>
        <SelectItem value='option2'>Option 2</SelectItem>
        <SelectItem value='option3'>Option 3</SelectItem>
      </SelectContent>
    </Select>
  )
};

// Interactive test
export const SelectionInteraction: Story = {
  render: () => (
    <Select>
      <SelectTrigger className='w-[240px]' data-testid='select-trigger'>
        <SelectValue placeholder='Select an option' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='option1'>Option 1</SelectItem>
        <SelectItem value='option2'>Option 2</SelectItem>
        <SelectItem value='option3'>Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId('select-trigger');

    // Open the select
    await userEvent.click(trigger);

    // Wait for the dropdown to appear and select an option
    const option = await within(document.body).findByText('Option 2');
    await userEvent.click(option);

    // Verify selection
    await expect(trigger).toHaveTextContent('Option 2');
  }
};
