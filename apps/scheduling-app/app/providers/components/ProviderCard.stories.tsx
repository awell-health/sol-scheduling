import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ProviderCard } from './ProviderCard';
import type { ProviderSummary } from '../_lib/types';

// Helper to generate dates for mock slots
const generateFutureDate = (daysFromNow: number, hour: number = 9) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
};

// Mock provider with slots
const mockProviderWithSlots: ProviderSummary = {
  id: 'provider-1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  bio: 'Dr. Sarah Johnson is a board-certified psychiatrist specializing in anxiety and depression. She takes a holistic approach to mental health care, combining medication management with lifestyle recommendations.',
  image: '/images/avatar.svg',
  profileLink: 'https://solmentalhealth.com/providers/sarah-johnson',
  location: {
    facility: 'CO - Cherry Creek',
    state: 'CO'
  },
  events: [
    {
      eventId: 'event-1',
      date: generateFutureDate(1),
      providerId: 'provider-1',
      slotstart: generateFutureDate(1, 9),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'Telehealth',
      location: 'Telehealth',
      booked: false
    },
    {
      eventId: 'event-2',
      date: generateFutureDate(1),
      providerId: 'provider-1',
      slotstart: generateFutureDate(1, 14),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'In-Person',
      location: 'In-Person',
      booked: false
    },
    {
      eventId: 'event-3',
      date: generateFutureDate(2),
      providerId: 'provider-1',
      slotstart: generateFutureDate(2, 10),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'Telehealth',
      location: 'Telehealth',
      booked: false
    },
    {
      eventId: 'event-4',
      date: generateFutureDate(2),
      providerId: 'provider-1',
      slotstart: generateFutureDate(2, 11),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'Telehealth',
      location: 'Telehealth',
      booked: false
    },
    {
      eventId: 'event-5',
      date: generateFutureDate(2),
      providerId: 'provider-1',
      slotstart: generateFutureDate(2, 15),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'In-Person',
      location: 'In-Person',
      booked: false
    },
    {
      eventId: 'event-6',
      date: generateFutureDate(3),
      providerId: 'provider-1',
      slotstart: generateFutureDate(3, 9),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'Telehealth',
      location: 'Telehealth',
      booked: false
    }
  ]
} as unknown as ProviderSummary;

// Mock provider without slots
const mockProviderNoSlots: ProviderSummary = {
  id: 'provider-2',
  firstName: 'Michael',
  lastName: 'Chen',
  bio: 'Michael Chen is a licensed therapist with expertise in CBT and mindfulness-based approaches. He works with adults and adolescents on anxiety, depression, and life transitions.',
  image: '/images/avatar.svg',
  location: {
    facility: 'NY - Union Square',
    state: 'NY'
  },
  events: []
} as unknown as ProviderSummary;

// Mock provider with minimal info
const mockProviderMinimal: ProviderSummary = {
  id: 'provider-3',
  firstName: 'Emily',
  lastName: 'Rodriguez',
  bio: '',
  image: '',
  location: {
    state: 'CO'
  },
  events: [
    {
      eventId: 'event-7',
      date: generateFutureDate(1),
      providerId: 'provider-3',
      slotstart: generateFutureDate(1, 10),
      duration: 60,
      facility: 'CO - Boulder',
      eventType: 'Telehealth',
      location: 'Telehealth',
      booked: false
    }
  ]
} as unknown as ProviderSummary;

const meta: Meta<typeof ProviderCard> = {
  title: 'Providers/ProviderCard',
  component: ProviderCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true
    }
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable interactions on the card'
    }
  },
  args: {
    onSelect: fn()
  }
};

export default meta;
type Story = StoryObj<typeof ProviderCard>;

// Default with slots
export const WithSlots: Story = {
  args: {
    provider: mockProviderWithSlots
  }
};

// Without slots (no availability)
export const WithoutSlots: Story = {
  args: {
    provider: mockProviderNoSlots
  }
};

// Minimal provider info
export const MinimalInfo: Story = {
  args: {
    provider: mockProviderMinimal
  }
};

// Disabled state
export const Disabled: Story = {
  args: {
    provider: mockProviderWithSlots,
    disabled: true
  }
};

// Mobile viewport
export const Mobile: Story = {
  args: {
    provider: mockProviderWithSlots
  },
  globals: {
    viewport: {
      value: 'mobile',
      isRotated: false
    }
  }
};

// Multiple cards (list view)
export const ListOfProviders: Story = {
  render: (args) => (
    <div className='space-y-4 max-w-3xl'>
      <ProviderCard {...args} provider={mockProviderWithSlots} />
      <ProviderCard {...args} provider={mockProviderNoSlots} />
      <ProviderCard {...args} provider={mockProviderMinimal} />
    </div>
  ),
  args: {
    provider: mockProviderWithSlots
  }
};

// Long bio text
export const LongBio: Story = {
  args: {
    provider: {
      ...mockProviderWithSlots,
      bio: 'Dr. Sarah Johnson is a board-certified psychiatrist with over 15 years of experience. She specializes in anxiety disorders, depression, ADHD, and bipolar disorder. Her approach combines evidence-based medication management with lifestyle recommendations and psychoeducation. Dr. Johnson believes in collaborative care and works closely with therapists to ensure comprehensive treatment. She is passionate about reducing stigma around mental health and empowering patients to take an active role in their wellness journey. She completed her residency at Johns Hopkins and has additional training in integrative psychiatry.'
    } as unknown as ProviderSummary
  }
};

// Only telehealth slots
export const TelehealthOnly: Story = {
  args: {
    provider: {
      ...mockProviderWithSlots,
      events: mockProviderWithSlots.events?.filter(
        (e) => e.location === 'Telehealth'
      )
    } as unknown as ProviderSummary
  }
};

// Only in-person slots
export const InPersonOnly: Story = {
  args: {
    provider: {
      ...mockProviderWithSlots,
      events: mockProviderWithSlots.events?.filter(
        (e) => e.location === 'In-Person'
      )
    } as unknown as ProviderSummary
  }
};
