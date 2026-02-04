import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import type { AvailabilitySlot } from '../../_lib/types';

// Helper to generate dates for mock slots
const generateFutureDate = (daysFromNow: number, hour: number = 9) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
};

// Get local day key for slot mapping
const getLocalDayKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generate mock slots
const generateMockSlots = (): AvailabilitySlot[] => {
  const slots: AvailabilitySlot[] = [];

  // Day 1 - 3 slots
  slots.push(
    {
      eventId: 'slot-1',
      date: generateFutureDate(1),
      providerId: 'provider-1',
      slotstart: generateFutureDate(1, 9),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'Telehealth',
      location: 'Telehealth',
      booked: false
    } as AvailabilitySlot,
    {
      eventId: 'slot-2',
      date: generateFutureDate(1),
      providerId: 'provider-1',
      slotstart: generateFutureDate(1, 10),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'Telehealth',
      location: 'Telehealth',
      booked: false
    } as AvailabilitySlot,
    {
      eventId: 'slot-3',
      date: generateFutureDate(1),
      providerId: 'provider-1',
      slotstart: generateFutureDate(1, 14),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'In-Person',
      location: 'In-Person',
      booked: false
    } as AvailabilitySlot
  );

  // Day 3 - 2 slots
  slots.push(
    {
      eventId: 'slot-4',
      date: generateFutureDate(3),
      providerId: 'provider-1',
      slotstart: generateFutureDate(3, 9),
      duration: 60,
      facility: 'CO - Boulder',
      eventType: 'In-Person',
      location: 'In-Person',
      booked: false
    } as AvailabilitySlot,
    {
      eventId: 'slot-5',
      date: generateFutureDate(3),
      providerId: 'provider-1',
      slotstart: generateFutureDate(3, 15),
      duration: 60,
      facility: 'CO - Boulder',
      eventType: 'Telehealth',
      location: 'Telehealth',
      booked: false
    } as AvailabilitySlot
  );

  // Day 5 - 1 slot
  slots.push({
    eventId: 'slot-6',
    date: generateFutureDate(5),
    providerId: 'provider-1',
    slotstart: generateFutureDate(5, 11),
    duration: 60,
    facility: 'CO - Cherry Creek',
    eventType: 'Telehealth',
    location: 'Telehealth',
    booked: false
  } as AvailabilitySlot);

  return slots;
};

// Build day slot map from slots
const buildDaySlotMap = (slots: AvailabilitySlot[]) => {
  const map = new Map<string, AvailabilitySlot[]>();
  for (const slot of slots) {
    const key = getLocalDayKey(new Date(slot.slotstart));
    const existing = map.get(key) || [];
    existing.push(slot);
    map.set(key, existing);
  }
  return map;
};

// Get unique days with slots
const getDaysWithSlots = (slots: AvailabilitySlot[]) => {
  const days = new Set<string>();
  for (const slot of slots) {
    days.add(getLocalDayKey(new Date(slot.slotstart)));
  }
  return Array.from(days).map((key) => {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
  });
};

const mockSlots = generateMockSlots();
const daySlotMap = buildDaySlotMap(mockSlots);
const daysWithSlots = getDaysWithSlots(mockSlots);

const meta: Meta<typeof AvailabilityCalendar> = {
  title: 'Booking/AvailabilityCalendar',
  component: AvailabilityCalendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true
    }
  },
  decorators: [
    (Story) => (
      <div className='max-w-3xl mx-auto'>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof AvailabilityCalendar>;

// Default with slots
export const Default: Story = {
  args: {
    loading: false,
    error: null,
    filteredSlots: mockSlots,
    allSlots: mockSlots,
    daySlotMap,
    daysWithSlots,
    locationOptions: ['CO - Cherry Creek', 'CO - Boulder'],
    locationFilter: 'all',
    onLocationFilterChange: fn(),
    selectedSlot: null,
    onSlotSelect: fn(),
    defaultMonth: new Date()
  }
};

// Loading state
export const Loading: Story = {
  args: {
    loading: true,
    error: null,
    filteredSlots: [],
    allSlots: [],
    daySlotMap: new Map(),
    daysWithSlots: [],
    locationOptions: [],
    locationFilter: 'all',
    onLocationFilterChange: fn(),
    selectedSlot: null,
    onSlotSelect: fn(),
    defaultMonth: new Date()
  }
};

// Error state
export const Error: Story = {
  args: {
    loading: false,
    error: 'Failed to load availability. Please try again.',
    filteredSlots: [],
    allSlots: [],
    daySlotMap: new Map(),
    daysWithSlots: [],
    locationOptions: [],
    locationFilter: 'all',
    onLocationFilterChange: fn(),
    selectedSlot: null,
    onSlotSelect: fn(),
    defaultMonth: new Date()
  }
};

// No slots available
export const NoSlots: Story = {
  args: {
    loading: false,
    error: null,
    filteredSlots: [],
    allSlots: [],
    daySlotMap: new Map(),
    daysWithSlots: [],
    locationOptions: [],
    locationFilter: 'all',
    onLocationFilterChange: fn(),
    selectedSlot: null,
    onSlotSelect: fn(),
    defaultMonth: new Date()
  }
};

// With selected slot
export const WithSelectedSlot: Story = {
  args: {
    loading: false,
    error: null,
    filteredSlots: mockSlots,
    allSlots: mockSlots,
    daySlotMap,
    daysWithSlots,
    locationOptions: ['CO - Cherry Creek', 'CO - Boulder'],
    locationFilter: 'all',
    onLocationFilterChange: fn(),
    selectedSlot: mockSlots[0],
    onSlotSelect: fn(),
    defaultMonth: new Date()
  }
};

// Single location (no filter dropdown)
export const SingleLocation: Story = {
  args: {
    loading: false,
    error: null,
    filteredSlots: mockSlots.filter((s) => s.facility === 'CO - Cherry Creek'),
    allSlots: mockSlots.filter((s) => s.facility === 'CO - Cherry Creek'),
    daySlotMap: buildDaySlotMap(
      mockSlots.filter((s) => s.facility === 'CO - Cherry Creek')
    ),
    daysWithSlots: getDaysWithSlots(
      mockSlots.filter((s) => s.facility === 'CO - Cherry Creek')
    ),
    locationOptions: [],
    locationFilter: 'all',
    onLocationFilterChange: fn(),
    selectedSlot: null,
    onSlotSelect: fn(),
    defaultMonth: new Date()
  }
};

// Filtered by location
export const FilteredByLocation: Story = {
  args: {
    loading: false,
    error: null,
    filteredSlots: mockSlots.filter((s) => s.facility === 'CO - Boulder'),
    allSlots: mockSlots,
    daySlotMap: buildDaySlotMap(
      mockSlots.filter((s) => s.facility === 'CO - Boulder')
    ),
    daysWithSlots: getDaysWithSlots(
      mockSlots.filter((s) => s.facility === 'CO - Boulder')
    ),
    locationOptions: ['CO - Cherry Creek', 'CO - Boulder'],
    locationFilter: 'CO - Boulder',
    onLocationFilterChange: fn(),
    selectedSlot: null,
    onSlotSelect: fn(),
    defaultMonth: new Date()
  }
};

// Mobile viewport
export const Mobile: Story = {
  args: {
    loading: false,
    error: null,
    filteredSlots: mockSlots,
    allSlots: mockSlots,
    daySlotMap,
    daysWithSlots,
    locationOptions: ['CO - Cherry Creek', 'CO - Boulder'],
    locationFilter: 'all',
    onLocationFilterChange: fn(),
    selectedSlot: null,
    onSlotSelect: fn(),
    defaultMonth: new Date()
  },
  globals: {
    viewport: {
      value: 'mobile',
      isRotated: false
    }
  }
};
