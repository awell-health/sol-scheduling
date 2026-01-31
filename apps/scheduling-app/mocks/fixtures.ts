/**
 * Mock fixture data for unit tests
 * 
 * Contains realistic mock data matching the SOL API response schemas.
 * Note: We use loose typing here because the mock data doesn't need to 
 * strictly match the zod-transformed types - it just needs to match what
 * the API returns before validation.
 */

// Helper to generate dates for mock slots
const generateFutureDate = (daysFromNow: number, hour: number = 9) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

/**
 * Mock provider event type (pre-zod transformation)
 */
interface MockProviderEvent {
  eventId: string;
  date: Date;
  providerId: string;
  slotstart: Date;
  duration: number;
  facility: string;
  eventType: string;
  location?: string;
  booked?: boolean;
}

/**
 * Mock provider type (pre-zod transformation)
 */
interface MockProvider {
  id: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  image?: string;
  profileLink?: string;
  location?: {
    facility?: string;
    state?: string;
  };
  events?: MockProviderEvent[];
}

/**
 * Mock providers for testing provider listing and filtering
 */
export const mockProviders: MockProvider[] = [
  {
    id: 'provider-psychiatry-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    bio: 'Dr. Sarah Johnson is a board-certified psychiatrist specializing in anxiety and depression. She takes a holistic approach to mental health care.',
    image: '/images/avatar.svg',
    location: {
      facility: 'CO - Cherry Creek',
      state: 'CO',
    },
    events: [
      {
        eventId: 'event-1',
        date: new Date(generateFutureDate(1)),
        providerId: 'provider-psychiatry-1',
        slotstart: new Date(generateFutureDate(1, 9)),
        duration: 60,
        facility: 'CO - Cherry Creek',
        eventType: 'Telehealth',
        location: 'Telehealth',
        booked: false,
      },
      {
        eventId: 'event-2',
        date: new Date(generateFutureDate(1)),
        providerId: 'provider-psychiatry-1',
        slotstart: new Date(generateFutureDate(1, 14)),
        duration: 60,
        facility: 'CO - Cherry Creek',
        eventType: 'In-Person',
        location: 'In-Person',
        booked: false,
      },
    ],
  },
  {
    id: 'provider-therapy-1',
    firstName: 'Michael',
    lastName: 'Chen',
    bio: 'Michael Chen is a licensed therapist with expertise in CBT and mindfulness-based approaches. He works with adults and adolescents.',
    image: '/images/avatar.svg',
    location: {
      facility: 'NY - Union Square',
      state: 'NY',
    },
    events: [
      {
        eventId: 'event-3',
        date: new Date(generateFutureDate(2)),
        providerId: 'provider-therapy-1',
        slotstart: new Date(generateFutureDate(2, 10)),
        duration: 50,
        facility: 'NY - Union Square',
        eventType: 'Telehealth',
        location: 'Telehealth',
        booked: false,
      },
    ],
  },
  {
    id: 'provider-psychiatry-2',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    bio: 'Dr. Emily Rodriguez specializes in ADHD and bipolar disorder treatment. She believes in collaborative care and patient empowerment.',
    image: '/images/avatar.svg',
    location: {
      facility: 'CO - Boulder',
      state: 'CO',
    },
    events: [],
  },
  {
    id: 'provider-therapy-2',
    firstName: 'David',
    lastName: 'Kim',
    bio: 'David Kim is a trauma-informed therapist specializing in PTSD and anxiety disorders. He uses EMDR and somatic experiencing techniques.',
    image: '/images/avatar.svg',
    location: {
      facility: 'VA - Tysons',
      state: 'VA',
    },
    events: [
      {
        eventId: 'event-4',
        date: new Date(generateFutureDate(3)),
        providerId: 'provider-therapy-2',
        slotstart: new Date(generateFutureDate(3, 15)),
        duration: 50,
        facility: 'VA - Tysons',
        eventType: 'In-Person',
        location: 'In-Person',
        booked: false,
      },
    ],
  },
];

/**
 * Mock provider details for single provider view
 */
export const mockProviderDetails: Record<string, MockProvider> = {
  'provider-psychiatry-1': {
    id: 'provider-psychiatry-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    bio: 'Dr. Sarah Johnson is a board-certified psychiatrist specializing in anxiety and depression. She takes a holistic approach to mental health care, combining medication management with lifestyle recommendations.',
    image: '/images/avatar.svg',
    profileLink: 'https://solmentalhealth.com/providers/sarah-johnson',
    location: {
      facility: 'CO - Cherry Creek',
      state: 'CO',
    },
  },
  'provider-therapy-1': {
    id: 'provider-therapy-1',
    firstName: 'Michael',
    lastName: 'Chen',
    bio: 'Michael Chen is a licensed therapist with expertise in CBT and mindfulness-based approaches. He works with adults and adolescents on anxiety, depression, and life transitions.',
    image: '/images/avatar.svg',
    profileLink: 'https://solmentalhealth.com/providers/michael-chen',
    location: {
      facility: 'NY - Union Square',
      state: 'NY',
    },
  },
  'provider-psychiatry-2': {
    id: 'provider-psychiatry-2',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    bio: 'Dr. Emily Rodriguez specializes in ADHD and bipolar disorder treatment. She believes in collaborative care and patient empowerment.',
    image: '/images/avatar.svg',
    profileLink: 'https://solmentalhealth.com/providers/emily-rodriguez',
    location: {
      facility: 'CO - Boulder',
      state: 'CO',
    },
  },
  'provider-therapy-2': {
    id: 'provider-therapy-2',
    firstName: 'David',
    lastName: 'Kim',
    bio: 'David Kim is a trauma-informed therapist specializing in PTSD and anxiety disorders. He uses EMDR and somatic experiencing techniques.',
    image: '/images/avatar.svg',
    profileLink: 'https://solmentalhealth.com/providers/david-kim',
    location: {
      facility: 'VA - Tysons',
      state: 'VA',
    },
  },
};

/**
 * Mock availability slots
 */
export const mockAvailability = {
  slots: [
    {
      eventId: 'slot-1',
      date: new Date(generateFutureDate(1)),
      providerId: 'provider-psychiatry-1',
      slotstart: new Date(generateFutureDate(1, 9)),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'Telehealth',
      location: 'Telehealth',
      booked: false,
    },
    {
      eventId: 'slot-2',
      date: new Date(generateFutureDate(1)),
      providerId: 'provider-psychiatry-1',
      slotstart: new Date(generateFutureDate(1, 10)),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'Telehealth',
      location: 'Telehealth',
      booked: false,
    },
    {
      eventId: 'slot-3',
      date: new Date(generateFutureDate(1)),
      providerId: 'provider-psychiatry-1',
      slotstart: new Date(generateFutureDate(1, 14)),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'In-Person',
      location: 'In-Person',
      booked: false,
    },
    {
      eventId: 'slot-4',
      date: new Date(generateFutureDate(2)),
      providerId: 'provider-psychiatry-1',
      slotstart: new Date(generateFutureDate(2, 9)),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'Telehealth',
      location: 'Telehealth',
      booked: false,
    },
    {
      eventId: 'slot-5',
      date: new Date(generateFutureDate(2)),
      providerId: 'provider-psychiatry-1',
      slotstart: new Date(generateFutureDate(2, 15)),
      duration: 60,
      facility: 'CO - Cherry Creek',
      eventType: 'In-Person',
      location: 'In-Person',
      booked: false,
    },
  ],
};

/**
 * Mock booking response
 */
export const mockBookingResponse = {
  success: {
    data: {
      success: true,
      eventId: 'booked-event-id',
      confirmationNumber: 'MOCK-12345',
    },
  },
  error: {
    errorCode: 'BOOKING_FAILED',
    errorMessage: 'The selected time slot is no longer available',
  },
};

/**
 * Mock onboarding data for localStorage pre-seeding
 */
export const mockOnboardingData = {
  complete: {
    state: 'CO',
    service: 'medication',
    phone: '+12025551234',
    insurance: 'Blue Cross Blue Shield',
    consent: true,
    updatedAt: new Date().toISOString(),
  },
  partial: {
    state: 'NY',
    service: 'therapy',
  },
  medicationOnly: {
    state: 'CO',
    service: 'medication',
    phone: '+13035551234',
    consent: true,
  },
  therapyOnly: {
    state: 'VA',
    service: 'therapy',
    phone: '+17035551234',
    consent: true,
  },
};

/**
 * Mock Salesforce lead data
 */
export const mockSalesforceData = {
  leadId: '00Q123456789ABCDEF',
  lead: {
    Id: '00Q123456789ABCDEF',
    Phone: '+12025551234',
    State: 'CO',
    FirstName: 'Test',
    LastName: 'User',
    Status: 'New',
    IsConverted: false,
    Insurance_Company_Name__c: 'Blue Cross Blue Shield',
    Medication__c: true,
    Therapy__c: false,
    Contact_Consent__c: true,
    Contact_Consent_Timestamp__c: new Date().toISOString(),
  },
};

/**
 * Mock workflow progress states
 */
export const mockWorkflowProgress = {
  booking: { step: 'booking', status: 'in_progress', message: 'Booking appointment...' },
  fetchingDetails: { step: 'fetchingDetails', status: 'in_progress', message: 'Fetching event details...' },
  creatingPatient: { step: 'creatingPatient', status: 'in_progress', message: 'Creating patient record...' },
  updatingLead: { step: 'updatingLead', status: 'in_progress', message: 'Updating lead...' },
  startingCareflow: { step: 'startingCareflow', status: 'in_progress', message: 'Starting intake careflow...' },
  complete: { step: 'complete', status: 'completed', message: 'Booking complete!' },
  error: { step: 'booking', status: 'error', message: 'Booking failed. Please try again.' },
};
