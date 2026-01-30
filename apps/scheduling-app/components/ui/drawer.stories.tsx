import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect } from 'storybook/test';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
  DrawerTitle
} from './drawer';
import { Button } from './button';

const meta: Meta<typeof Drawer> = {
  title: 'UI/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof Drawer>;

// Default drawer
export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='p-4'>
          <p className='text-slate-700'>This is a basic drawer.</p>
        </div>
      </DrawerContent>
    </Drawer>
  )
};

// With header
export const WithHeader: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='text-lg font-semibold'>
            Drawer Title
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant='ghost' size='sm'>
              Close
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className='p-4'>
          <p className='text-slate-700'>Drawer content goes here.</p>
        </div>
      </DrawerContent>
    </Drawer>
  )
};

// With header and footer
export const WithHeaderAndFooter: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='text-lg font-semibold'>
            Edit Profile
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon'>
              ✕
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className='p-4 space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Name</label>
            <input
              type='text'
              defaultValue='John Doe'
              className='w-full px-3 py-2 border border-slate-300 rounded-md'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Email</label>
            <input
              type='email'
              defaultValue='john@example.com'
              className='w-full px-3 py-2 border border-slate-300 rounded-md'
            />
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
          <Button>Save changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
};

// Scrollable content
export const ScrollableContent: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent className='max-h-[85vh]'>
        <DrawerHeader>
          <DrawerTitle className='text-lg font-semibold'>
            Terms & Conditions
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon'>
              ✕
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className='p-4 overflow-y-auto flex-1'>
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className='text-slate-700 mb-4'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline'>Decline</Button>
          </DrawerClose>
          <Button>Accept</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
};

// Real-world: Filter drawer (mobile)
export const FilterDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='outline'>
          <span className='mr-2'>☰</span>
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='text-lg font-semibold'>
            Filter Providers
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon'>
              ✕
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className='p-4 space-y-6'>
          <div className='space-y-3'>
            <h4 className='text-sm font-medium text-slate-900'>Service Type</h4>
            <div className='space-y-2'>
              <label className='flex items-center gap-2'>
                <input type='checkbox' defaultChecked className='rounded' />
                <span className='text-sm'>Medication Management</span>
              </label>
              <label className='flex items-center gap-2'>
                <input type='checkbox' className='rounded' />
                <span className='text-sm'>Therapy</span>
              </label>
              <label className='flex items-center gap-2'>
                <input type='checkbox' className='rounded' />
                <span className='text-sm'>Both</span>
              </label>
            </div>
          </div>
          <div className='space-y-3'>
            <h4 className='text-sm font-medium text-slate-900'>Availability</h4>
            <div className='space-y-2'>
              <label className='flex items-center gap-2'>
                <input type='checkbox' defaultChecked className='rounded' />
                <span className='text-sm'>This week</span>
              </label>
              <label className='flex items-center gap-2'>
                <input type='checkbox' className='rounded' />
                <span className='text-sm'>Next week</span>
              </label>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button variant='outline' className='flex-1'>
            Clear all
          </Button>
          <DrawerClose asChild>
            <Button className='flex-1'>Apply filters</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
};

// Real-world: Booking confirmation drawer
export const BookingConfirmation: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Book Appointment</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='text-lg font-semibold'>
            Confirm Booking
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon'>
              ✕
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className='p-4 space-y-4'>
          <div className='p-4 bg-slate-50 rounded-lg space-y-2'>
            <div className='flex justify-between'>
              <span className='text-sm text-slate-500'>Provider</span>
              <span className='text-sm font-medium'>Dr. Sarah Johnson</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-slate-500'>Date</span>
              <span className='text-sm font-medium'>January 30, 2026</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-slate-500'>Time</span>
              <span className='text-sm font-medium'>2:00 PM EST</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-slate-500'>Type</span>
              <span className='text-sm font-medium'>Video Visit</span>
            </div>
          </div>
          <p className='text-xs text-slate-500'>
            By confirming, you agree to our cancellation policy. You can cancel
            or reschedule up to 24 hours before your appointment.
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
          <Button>Confirm Booking</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
};

// Interactive test
export const OpenCloseInteraction: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button data-testid='drawer-trigger'>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent data-testid='drawer-content'>
        <DrawerHeader>
          <DrawerTitle className='text-lg font-semibold'>
            Test Drawer
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant='ghost' size='sm' data-testid='drawer-close'>
              Close
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className='p-4'>
          <p>Drawer content for testing.</p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId('drawer-trigger');

    // Open the drawer
    await userEvent.click(trigger);

    // Wait for drawer content to appear
    const content = await within(document.body).findByTestId('drawer-content');
    await expect(content).toBeVisible();

    // Close the drawer
    const closeButton = within(document.body).getByTestId('drawer-close');
    await userEvent.click(closeButton);
  }
};
