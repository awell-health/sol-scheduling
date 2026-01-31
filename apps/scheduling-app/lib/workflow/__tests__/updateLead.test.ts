import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create mock functions outside the vi.mock factory
const mockUpdateLead = vi.fn();

// Mock the workflow module
vi.mock('workflow', () => ({
  getWorkflowMetadata: () => ({
    workflowRunId: 'run-123'
  })
}));

// Mock the Salesforce client - use a function that captures the outer mockUpdateLead
vi.mock('../../salesforce', () => ({
  getSalesforceClient: () => ({
    updateLead: (...args: unknown[]) => mockUpdateLead(...args)
  })
}));

// Mock the transformers module
vi.mock('../../../app/providers/_lib/salesforce/transformers', () => ({
  mapServiceToSalesforce: (service: string) => {
    switch (service) {
      case 'Psychiatric':
        return { Medication__c: true, Therapy__c: false };
      case 'Therapy':
        return { Medication__c: false, Therapy__c: true };
      case 'Both':
        return { Medication__c: true, Therapy__c: true };
      default:
        return { Medication__c: false, Therapy__c: false };
    }
  }
}));

import { updateLeadStep, type UpdateLeadInput } from '../steps/updateLead';

describe('updateLeadStep', () => {
  const defaultInput: UpdateLeadInput = {
    leadId: 'lead-123',
    firstName: 'John',
    lastName: 'Doe',
    clinicalFocus: 'Anxiety',
    service: 'Psychiatric',
    eventType: 'Telehealth',
    providerFirstName: 'Sarah',
    providerLastName: 'Johnson',
    slotStartUtc: '2024-06-20T14:00:00.000Z',
    localizedDate: '2024-06-20',
    localizedTimeWithTimezone: '8:00 AM America/Denver',
    facility: 'CO - Cherry Creek'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateLead.mockResolvedValue(undefined);
    process.env.VERCEL_URL = 'schedule.solmentalhealth.com';
  });

  afterEach(() => {
    delete process.env.VERCEL_URL;
  });

  describe('successful update', () => {
    it('returns success when update succeeds', async () => {
      const result = await updateLeadStep(defaultInput);

      expect(result).toEqual({ success: true });
      expect(mockUpdateLead).toHaveBeenCalledTimes(1);
    });

    it('always sets RecordTypeId and Status', async () => {
      await updateLeadStep(defaultInput);

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          RecordTypeId: '0125w000000BRDxAAO',
          Status: 'New'
        })
      );
    });

    it('includes Magic_Link__c with confirmation URL', async () => {
      await updateLeadStep(defaultInput);

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Magic_Link__c:
            'https://schedule.solmentalhealth.com/confirmation/run-123'
        })
      );
    });

    it('uses default base URL when VERCEL_URL not set', async () => {
      delete process.env.VERCEL_URL;

      await updateLeadStep(defaultInput);

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Magic_Link__c:
            'https://schedule.solmentalhealth.com/confirmation/run-123'
        })
      );
    });
  });

  describe('field mapping', () => {
    it('maps firstName to FirstName', async () => {
      await updateLeadStep(defaultInput);

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          FirstName: 'John'
        })
      );
    });

    it('maps lastName to LastName', async () => {
      await updateLeadStep(defaultInput);

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          LastName: 'Doe'
        })
      );
    });

    it('maps clinicalFocus to Visit_Reason__c', async () => {
      await updateLeadStep(defaultInput);

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Visit_Reason__c: 'Anxiety'
        })
      );
    });

    it('maps eventType to Visit_Preference__c', async () => {
      await updateLeadStep(defaultInput);

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Visit_Preference__c: 'Telehealth'
        })
      );
    });

    it('maps facility to Facility__c', async () => {
      await updateLeadStep(defaultInput);

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Facility__c: 'CO - Cherry Creek'
        })
      );
    });

    it('maps localizedTimeWithTimezone to Requested_Appt_Time__c', async () => {
      await updateLeadStep(defaultInput);

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Requested_Appt_Time__c: '8:00 AM America/Denver'
        })
      );
    });
  });

  describe('service type mapping', () => {
    it('maps Psychiatric service to Medication__c only', async () => {
      await updateLeadStep({ ...defaultInput, service: 'Psychiatric' });

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Medication__c: true,
          Therapy__c: false
        })
      );
    });

    it('maps Therapy service to Therapy__c only', async () => {
      await updateLeadStep({ ...defaultInput, service: 'Therapy' });

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Medication__c: false,
          Therapy__c: true
        })
      );
    });

    it('maps Both service to both fields', async () => {
      await updateLeadStep({ ...defaultInput, service: 'Both' });

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Medication__c: true,
          Therapy__c: true
        })
      );
    });
  });

  describe('clinician name formatting', () => {
    it('formats clinician name as "LastName, FirstName"', async () => {
      await updateLeadStep(defaultInput);

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Clinician_request_from_Online_Booking__c: 'Johnson, Sarah'
        })
      );
    });

    it('uses only lastName when firstName missing', async () => {
      await updateLeadStep({
        ...defaultInput,
        providerFirstName: undefined
      });

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Clinician_request_from_Online_Booking__c: 'Johnson'
        })
      );
    });

    it('uses only firstName when lastName missing', async () => {
      await updateLeadStep({
        ...defaultInput,
        providerLastName: undefined
      });

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Clinician_request_from_Online_Booking__c: 'Sarah'
        })
      );
    });

    it('omits clinician field when both names missing', async () => {
      await updateLeadStep({
        ...defaultInput,
        providerFirstName: undefined,
        providerLastName: undefined
      });

      const updateData = mockUpdateLead.mock.calls[0][1];
      expect(updateData).not.toHaveProperty(
        'Clinician_request_from_Online_Booking__c'
      );
    });
  });

  describe('date handling', () => {
    it('uses localizedDate for Requested_Appt_Date__c when available', async () => {
      await updateLeadStep(defaultInput);

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Requested_Appt_Date__c: '2024-06-20'
        })
      );
    });

    it('falls back to slotStartUtc when localizedDate missing', async () => {
      await updateLeadStep({
        ...defaultInput,
        localizedDate: undefined
      });

      expect(mockUpdateLead).toHaveBeenCalledWith(
        'lead-123',
        expect.objectContaining({
          Requested_Appt_Date__c: '2024-06-20T14:00:00.000Z'
        })
      );
    });

    it('omits date field when both are missing', async () => {
      await updateLeadStep({
        ...defaultInput,
        localizedDate: undefined,
        slotStartUtc: undefined
      });

      const updateData = mockUpdateLead.mock.calls[0][1];
      expect(updateData).not.toHaveProperty('Requested_Appt_Date__c');
    });
  });

  describe('optional fields', () => {
    it('omits firstName when not provided', async () => {
      await updateLeadStep({
        leadId: 'lead-123'
      });

      const updateData = mockUpdateLead.mock.calls[0][1];
      expect(updateData).not.toHaveProperty('FirstName');
    });

    it('omits clinicalFocus when not provided', async () => {
      await updateLeadStep({
        leadId: 'lead-123'
      });

      const updateData = mockUpdateLead.mock.calls[0][1];
      expect(updateData).not.toHaveProperty('Visit_Reason__c');
    });

    it('omits service fields when not provided', async () => {
      await updateLeadStep({
        leadId: 'lead-123'
      });

      const updateData = mockUpdateLead.mock.calls[0][1];
      expect(updateData).not.toHaveProperty('Medication__c');
      expect(updateData).not.toHaveProperty('Therapy__c');
    });

    it('handles minimal input (only leadId)', async () => {
      const result = await updateLeadStep({
        leadId: 'lead-123'
      });

      expect(result).toEqual({ success: true });
      expect(mockUpdateLead).toHaveBeenCalledWith('lead-123', {
        RecordTypeId: '0125w000000BRDxAAO',
        Status: 'New',
        Magic_Link__c: expect.any(String)
      });
    });
  });

  describe('error handling', () => {
    it('returns error result when Salesforce update fails', async () => {
      mockUpdateLead.mockRejectedValueOnce(new Error('Salesforce API error'));

      const result = await updateLeadStep(defaultInput);

      expect(result).toEqual({
        success: false,
        error: 'Salesforce API error'
      });
    });

    it('handles non-Error exceptions', async () => {
      mockUpdateLead.mockRejectedValueOnce('String error');

      const result = await updateLeadStep(defaultInput);

      expect(result).toEqual({
        success: false,
        error: 'Unknown error'
      });
    });

    it('does not throw on error - returns result instead', async () => {
      mockUpdateLead.mockRejectedValueOnce(new Error('API error'));

      await expect(updateLeadStep(defaultInput)).resolves.toEqual({
        success: false,
        error: 'API error'
      });
    });
  });
});
