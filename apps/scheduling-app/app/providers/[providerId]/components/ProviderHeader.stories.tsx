import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProviderHeader } from './ProviderHeader';
import type { ProviderSummary } from '../../_lib/types';

// Mock provider data
const mockProvider: ProviderSummary = {
  id: 'provider-1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  bio: 'Dr. Sarah Johnson is a board-certified psychiatrist specializing in anxiety and depression. She takes a holistic approach to mental health care, combining medication management with lifestyle recommendations.',
  image: '/images/avatar.svg',
  profileLink: 'https://solmentalhealth.com/providers/sarah-johnson',
  location: {
    facility: 'CO - Cherry Creek',
    state: 'CO'
  }
} as unknown as ProviderSummary;

const mockProviderMinimal: ProviderSummary = {
  id: 'provider-2',
  firstName: 'Michael',
  lastName: 'Chen',
  bio: '',
  image: '',
  location: {
    state: 'NY'
  }
} as unknown as ProviderSummary;

const mockProviderLongBio: ProviderSummary = {
  id: 'provider-3',
  firstName: 'Emily',
  lastName: 'Rodriguez',
  bio: 'Dr. Emily Rodriguez is a board-certified psychiatrist with over 15 years of experience. She specializes in anxiety disorders, depression, ADHD, and bipolar disorder. Her approach combines evidence-based medication management with lifestyle recommendations and psychoeducation. Dr. Rodriguez believes in collaborative care and works closely with therapists to ensure comprehensive treatment. She is passionate about reducing stigma around mental health and empowering patients to take an active role in their wellness journey.',
  image: '/images/avatar.svg',
  profileLink: 'https://solmentalhealth.com/providers/emily-rodriguez',
  location: {
    facility: 'CO - Boulder',
    state: 'CO'
  }
} as unknown as ProviderSummary;

const mockSelectedSlot = {
  when: 'Mon Jan 30 at 9:00 AM',
  meta: '60 mins • Virtual video visit'
};

const meta: Meta<typeof ProviderHeader> = {
  title: 'Booking/ProviderHeader',
  component: ProviderHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true
    }
  },
  decorators: [
    (Story) => (
      <div className='max-w-3xl mx-auto pt-16'>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof ProviderHeader>;

// Default without selected slot
export const Default: Story = {
  args: {
    provider: mockProvider,
    selectedSlotSummary: null
  }
};

// With selected slot
export const WithSelectedSlot: Story = {
  args: {
    provider: mockProvider,
    selectedSlotSummary: mockSelectedSlot
  }
};

// Minimal provider info
export const MinimalInfo: Story = {
  args: {
    provider: mockProviderMinimal,
    selectedSlotSummary: null
  }
};

// Long bio
export const LongBio: Story = {
  args: {
    provider: mockProviderLongBio,
    selectedSlotSummary: null
  }
};

// In-person appointment selected
export const InPersonSelected: Story = {
  args: {
    provider: mockProvider,
    selectedSlotSummary: {
      when: 'Wed Feb 1 at 2:00 PM',
      meta: '60 mins • In-person at CO - Cherry Creek'
    }
  }
};

// Mobile viewport
export const Mobile: Story = {
  args: {
    provider: mockProvider,
    selectedSlotSummary: mockSelectedSlot
  },
  globals: {
    viewport: {
      value: 'mobile',
      isRotated: false
    }
  }
};
