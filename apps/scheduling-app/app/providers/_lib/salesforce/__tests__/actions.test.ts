import { describe, it, expect, vi, beforeEach } from 'vitest';

// Hoisted mocks for functions used in vi.mock
const {
  mockGetLead,
  mockCreateLead,
  mockUpdateLead,
  mockStart,
  mockPostHogIdentify,
  mockPostHogCapture,
  mockPostHogFlush
} = vi.hoisted(() => ({
  mockGetLead: vi.fn(),
  mockCreateLead: vi.fn(),
  mockUpdateLead: vi.fn(),
  mockStart: vi.fn(),
  mockPostHogIdentify: vi.fn(),
  mockPostHogCapture: vi.fn(),
  mockPostHogFlush: vi.fn()
}));

// Mock Salesforce client - use relative path from this test file
vi.mock('../../../../../lib/salesforce', () => ({
  getSalesforceClient: () => ({
    getLead: mockGetLead,
    createLead: mockCreateLead,
    updateLead: mockUpdateLead
  })
}));

// Mock PostHog
vi.mock('../../../../../posthog', () => ({
  default: () => ({
    identify: mockPostHogIdentify,
    capture: mockPostHogCapture,
    flush: mockPostHogFlush.mockResolvedValue(undefined)
  })
}));

// Mock workflow/api
vi.mock('workflow/api', () => ({
  start: mockStart
}));

// Mock field registry - use relative path
vi.mock('../../../../../lib/fields', () => ({
  FieldId: {
    PHONE: 'phone',
    STATE: 'state',
    INSURANCE: 'insurance',
    CONSENT: 'consent',
    SERVICE: 'service'
  },
  getSalesforceReadField: (fieldId: string) => {
    const mapping: Record<string, string> = {
      phone: 'Phone',
      state: 'State__c',
      insurance: 'Insurance_Carrier__c',
      consent: 'Contact_Consent__c'
    };
    return mapping[fieldId] ?? fieldId;
  },
  getSalesforceWriteField: (fieldId: string) => {
    const mapping: Record<string, string> = {
      phone: 'Phone',
      state: 'State__c',
      insurance: 'Insurance_Carrier__c',
      consent: 'Contact_Consent__c'
    };
    return mapping[fieldId] ?? fieldId;
  }
}));

import {
  getLeadAction,
  checkLeadStatusAction,
  createLeadAction,
  updateLeadAction,
  ensureLeadExistsAction
} from '../actions';

describe('Salesforce Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStart.mockResolvedValue({ runId: 'mock-run-id' });
    mockPostHogFlush.mockResolvedValue(undefined);
  });

  describe('getLeadAction', () => {
    it('returns lead data with mapped fields', async () => {
      mockGetLead.mockResolvedValue({
        Phone: '+13035551234',
        State__c: 'CO',
        Insurance_Carrier__c: 'Aetna',
        Medication__c: true,
        Therapy__c: false,
        Contact_Consent__c: true,
        Contact_Consent_Timestamp__c: '2024-06-15T10:00:00Z'
      });

      const result = await getLeadAction('lead-123');

      expect(result.success).toBe(true);
      expect(result.lead).toEqual({
        id: 'lead-123',
        phone: '+13035551234',
        state: 'CO',
        insurance: 'Aetna',
        service: 'Psychiatric', // mapSalesforceToService returns capitalized values
        consent: true,
        consentTimestamp: '2024-06-15T10:00:00Z'
      });
    });

    it('returns error for empty lead ID', async () => {
      const result = await getLeadAction('');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Lead ID is required');
    });

    it('returns error for whitespace-only lead ID', async () => {
      const result = await getLeadAction('   ');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Lead ID is required');
    });

    it('handles Salesforce API errors', async () => {
      mockGetLead.mockRejectedValue(new Error('Salesforce connection failed'));

      const result = await getLeadAction('lead-123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Salesforce connection failed');
    });

    it('maps therapy service type correctly', async () => {
      mockGetLead.mockResolvedValue({
        Phone: '+13035551234',
        Medication__c: false,
        Therapy__c: true
      });

      const result = await getLeadAction('lead-123');

      expect(result.lead?.service).toBe('Therapy');
    });

    it('maps both service type correctly', async () => {
      mockGetLead.mockResolvedValue({
        Phone: '+13035551234',
        Medication__c: true,
        Therapy__c: true
      });

      const result = await getLeadAction('lead-123');

      expect(result.lead?.service).toBe('Both');
    });

    it('handles null/undefined fields gracefully', async () => {
      mockGetLead.mockResolvedValue({
        Phone: null,
        State__c: undefined
      });

      const result = await getLeadAction('lead-123');

      expect(result.success).toBe(true);
      expect(result.lead?.phone).toBeNull();
      expect(result.lead?.state).toBeNull();
    });

    it('normalizes phone numbers from Salesforce format', async () => {
      mockGetLead.mockResolvedValue({
        Phone: '(303) 555-1234'
      });

      const result = await getLeadAction('lead-123');

      // Should normalize to E.164 format
      expect(result.lead?.phone).toBe('+13035551234');
    });
  });

  describe('checkLeadStatusAction', () => {
    it('returns exists true for valid lead', async () => {
      mockGetLead.mockResolvedValue({
        exists: true,
        IsConverted: false
      });

      const result = await checkLeadStatusAction('lead-123');

      expect(result.success).toBe(true);
      expect(result.exists).toBe(true);
      expect(result.isConverted).toBe(false);
    });

    it('returns isConverted true for converted lead', async () => {
      mockGetLead.mockResolvedValue({
        exists: true,
        IsConverted: true
      });

      const result = await checkLeadStatusAction('lead-123');

      expect(result.success).toBe(true);
      expect(result.exists).toBe(true);
      expect(result.isConverted).toBe(true);
    });

    it('returns error for empty lead ID', async () => {
      const result = await checkLeadStatusAction('');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Lead ID is required');
    });

    it('returns exists false for 404 error', async () => {
      mockGetLead.mockRejectedValue(new Error('404 NOT_FOUND'));

      const result = await checkLeadStatusAction('lead-123');

      expect(result.success).toBe(true);
      expect(result.exists).toBe(false);
      expect(result.isConverted).toBe(false);
    });

    it('returns exists false for deleted entity error', async () => {
      mockGetLead.mockRejectedValue(new Error('ENTITY_IS_DELETED'));

      const result = await checkLeadStatusAction('lead-123');

      expect(result.success).toBe(true);
      expect(result.exists).toBe(false);
    });

    it('handles unexpected errors', async () => {
      mockGetLead.mockRejectedValue(new Error('Network timeout'));

      const result = await checkLeadStatusAction('lead-123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network timeout');
    });
  });

  describe('createLeadAction', () => {
    beforeEach(() => {
      mockCreateLead.mockResolvedValue({ success: true, id: 'new-lead-123' });
    });

    it('creates lead with required fields', async () => {
      const result = await createLeadAction({
        phone: '+13035551234'
      });

      expect(result.success).toBe(true);
      expect(result.leadId).toBe('new-lead-123');
      expect(mockCreateLead).toHaveBeenCalledWith(
        expect.objectContaining({
          Phone: '(303) 555-1234', // Formatted for Salesforce
          RecordTypeId: '0125w000000BRDxAAO',
          FirstName: 'No',
          LastName: 'Name Yet',
          LeadSource: 'Website - Online Booking',
          Status: 'New'
        })
      );
    });

    it('includes optional fields when provided', async () => {
      await createLeadAction({
        phone: '+13035551234',
        state: 'CO',
        insurance: 'Aetna',
        service: 'Psychiatric', // Uses capitalized values
        consent: true
      });

      expect(mockCreateLead).toHaveBeenCalledWith(
        expect.objectContaining({
          State__c: 'CO',
          Insurance_Carrier__c: 'Aetna',
          Medication__c: true,
          Therapy__c: false
        })
      );
    });

    it('maps service type Both to Salesforce fields', async () => {
      await createLeadAction({
        phone: '+13035551234',
        service: 'Both' // Uses capitalized values
      });

      expect(mockCreateLead).toHaveBeenCalledWith(
        expect.objectContaining({
          Medication__c: true,
          Therapy__c: true
        })
      );
    });

    it('includes UTM parameters', async () => {
      await createLeadAction({
        phone: '+13035551234',
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'brand'
      });

      expect(mockCreateLead).toHaveBeenCalledWith(
        expect.objectContaining({
          UTM_Source__c: 'google',
          UTM_Medium__c: 'cpc',
          UTM_Campaign__c: 'brand'
        })
      );
    });

    it('links to PostHog when distinctId provided', async () => {
      await createLeadAction({
        phone: '+13035551234',
        posthogDistinctId: 'ph-distinct-123'
      });

      expect(mockPostHogIdentify).toHaveBeenCalledWith({
        distinctId: 'ph-distinct-123',
        properties: { salesforce_lead_id: 'new-lead-123' }
      });
      expect(mockPostHogCapture).toHaveBeenCalledWith({
        distinctId: 'ph-distinct-123',
        event: 'lead_created',
        properties: { salesforce_lead_id: 'new-lead-123' }
      });
      expect(mockPostHogFlush).toHaveBeenCalled();
    });

    it('handles duplicate lead detection by returning existing ID', async () => {
      const duplicateError = new Error(
        'Salesforce API error: 400 [{"errorCode":"DUPLICATES_DETECTED","duplicateResult":{"matchResults":[{"matchRecords":[{"record":{"Id":"existing-lead-456"}}]}]}}]'
      );
      mockCreateLead.mockRejectedValue(duplicateError);
      mockUpdateLead.mockResolvedValue({ success: true });

      const result = await createLeadAction({
        phone: '+13035551234'
      });

      expect(result.success).toBe(true);
      expect(result.leadId).toBe('existing-lead-456');
      // Should update existing lead
      expect(mockUpdateLead).toHaveBeenCalledWith(
        'existing-lead-456',
        expect.objectContaining({ Status: 'New' })
      );
    });

    it('starts re-engagement workflow after creation', async () => {
      await createLeadAction({
        phone: '+13035551234',
        state: 'CO'
      });

      expect(mockStart).toHaveBeenCalledWith(
        expect.anything(), // reengagementCareflowWorkflow
        [
          expect.objectContaining({
            salesforceLeadId: 'new-lead-123',
            phone: '+13035551234',
            state: 'CO'
          })
        ]
      );
    });

    it('returns error on create failure (non-duplicate)', async () => {
      mockCreateLead.mockRejectedValue(new Error('REQUIRED_FIELD_MISSING'));

      const result = await createLeadAction({
        phone: '+13035551234'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('REQUIRED_FIELD_MISSING');
    });
  });

  describe('updateLeadAction', () => {
    beforeEach(() => {
      mockUpdateLead.mockResolvedValue({ success: true });
    });

    it('updates insurance field', async () => {
      const result = await updateLeadAction({
        leadId: 'lead-123',
        insurance: 'Aetna'
      });

      expect(result.success).toBe(true);
      expect(mockUpdateLead).toHaveBeenCalledWith('lead-123', {
        Insurance_Carrier__c: 'Aetna'
      });
    });

    it('updates state field', async () => {
      const result = await updateLeadAction({
        leadId: 'lead-123',
        state: 'CO'
      });

      expect(result.success).toBe(true);
      expect(mockUpdateLead).toHaveBeenCalledWith('lead-123', {
        State__c: 'CO'
      });
    });

    it('updates both fields when provided', async () => {
      const result = await updateLeadAction({
        leadId: 'lead-123',
        insurance: 'Aetna',
        state: 'CO'
      });

      expect(result.success).toBe(true);
      expect(mockUpdateLead).toHaveBeenCalledWith('lead-123', {
        Insurance_Carrier__c: 'Aetna',
        State__c: 'CO'
      });
    });

    it('does not call Salesforce when no fields provided', async () => {
      const result = await updateLeadAction({
        leadId: 'lead-123'
      });

      expect(result.success).toBe(true);
      expect(mockUpdateLead).not.toHaveBeenCalled();
    });

    it('handles update errors', async () => {
      mockUpdateLead.mockRejectedValue(new Error('Lead is locked'));

      const result = await updateLeadAction({
        leadId: 'lead-123',
        insurance: 'Aetna'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Lead is locked');
    });
  });

  describe('ensureLeadExistsAction', () => {
    const defaultInput = {
      phone: '+13035551234',
      state: 'CO',
      service: 'Psychiatric' // Uses capitalized values
    };

    it('returns existing lead ID if valid', async () => {
      mockGetLead.mockResolvedValue({
        exists: true,
        IsConverted: false
      });

      const result = await ensureLeadExistsAction({
        ...defaultInput,
        currentLeadId: 'existing-lead-123'
      });

      expect(result.success).toBe(true);
      expect(result.leadId).toBe('existing-lead-123');
      expect(result.wasRecreated).toBe(false);
    });

    it('creates new lead if no currentLeadId provided', async () => {
      mockCreateLead.mockResolvedValue({ success: true, id: 'new-lead-123' });

      const result = await ensureLeadExistsAction(defaultInput);

      expect(result.success).toBe(true);
      expect(result.leadId).toBe('new-lead-123');
      expect(result.wasRecreated).toBe(true);
    });

    it('recreates lead if current lead does not exist (404)', async () => {
      // checkLeadStatusAction returns exists: false when API throws 404
      mockGetLead.mockRejectedValue(
        new Error('404 NOT_FOUND - Lead does not exist')
      );
      mockCreateLead.mockResolvedValue({ success: true, id: 'new-lead-456' });

      const result = await ensureLeadExistsAction({
        ...defaultInput,
        currentLeadId: 'deleted-lead-123'
      });

      expect(result.success).toBe(true);
      expect(result.leadId).toBe('new-lead-456');
      expect(result.wasRecreated).toBe(true);
    });

    it('recreates lead if current lead is converted', async () => {
      mockGetLead.mockResolvedValue({
        exists: true,
        IsConverted: true
      });
      mockCreateLead.mockResolvedValue({ success: true, id: 'new-lead-789' });

      const result = await ensureLeadExistsAction({
        ...defaultInput,
        currentLeadId: 'converted-lead-123'
      });

      expect(result.success).toBe(true);
      expect(result.leadId).toBe('new-lead-789');
      expect(result.wasRecreated).toBe(true);
    });

    it('handles ENTITY_IS_DELETED error by recreating', async () => {
      mockGetLead.mockRejectedValue(new Error('ENTITY_IS_DELETED'));
      mockCreateLead.mockResolvedValue({ success: true, id: 'new-lead-abc' });

      const result = await ensureLeadExistsAction({
        ...defaultInput,
        currentLeadId: 'deleted-lead'
      });

      expect(result.success).toBe(true);
      expect(result.leadId).toBe('new-lead-abc');
      expect(result.wasRecreated).toBe(true);
    });

    it('passes all preferences when creating new lead', async () => {
      mockCreateLead.mockResolvedValue({ success: true, id: 'new-lead' });

      await ensureLeadExistsAction({
        phone: '+13035551234',
        state: 'CO',
        service: 'Therapy', // Uses capitalized values
        insurance: 'Cigna',
        consent: true,
        posthogDistinctId: 'ph-123'
      });

      expect(mockCreateLead).toHaveBeenCalledWith(
        expect.objectContaining({
          Phone: '(303) 555-1234',
          State__c: 'CO',
          Insurance_Carrier__c: 'Cigna',
          Therapy__c: true,
          Medication__c: false
        })
      );
    });

    it('returns error when create fails', async () => {
      mockCreateLead.mockResolvedValue({ success: false, errors: ['Failed'] });

      const result = await ensureLeadExistsAction(defaultInput);

      expect(result.success).toBe(false);
    });
  });
});
