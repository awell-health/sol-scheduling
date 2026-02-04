import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create mock functions that will be referenced by the mock factory
const mockOrchestrationMutation = vi.fn();
const mockOrchestrationQuery = vi.fn();

// Mock Awell SDK - the factory function runs synchronously when the module is loaded
vi.mock('@awell-health/awell-sdk', () => {
  return {
    AwellSdk: class MockAwellSdk {
      orchestration = {
        mutation: mockOrchestrationMutation,
        query: mockOrchestrationQuery
      };
    }
  };
});

// Import after mocks are set up
import { upsertAwellPatientStep } from '../steps/upsertAwellPatient';
import { startIntakeCareflowStep } from '../steps/startIntakeCareflow';
import { startReengagementCareflowStep } from '../steps/startReengagementCareflow';
import { haltReengagementCareflowsStep } from '../steps/haltReengagementCareflows';
import { startHostedActivitySessionStep } from '../steps/startHostedActivitySession';

describe('upsertAwellPatientStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AWELL_API_KEY = 'test-api-key';
    process.env.AWELL_ENVIRONMENT = 'sandbox';
    process.env.SALESFORCE_IDENTIFIER_SYSTEM = 'salesforce-system';
  });

  afterEach(() => {
    delete process.env.AWELL_API_KEY;
    delete process.env.AWELL_ENVIRONMENT;
    delete process.env.SALESFORCE_IDENTIFIER_SYSTEM;
  });

  it('upserts patient with required fields', async () => {
    mockOrchestrationMutation.mockResolvedValueOnce({
      upsertPatient: {
        patient: { id: 'patient-123' }
      }
    });

    const result = await upsertAwellPatientStep({
      salesforceLeadId: 'lead-456',
      firstName: 'John',
      lastName: 'Doe'
    });

    expect(result).toEqual({ patientId: 'patient-123' });

    expect(mockOrchestrationMutation).toHaveBeenCalledWith({
      upsertPatient: {
        __args: {
          input: {
            patient_identifier: {
              system: 'salesforce-system',
              value: 'lead-456'
            },
            profile: {
              first_name: 'John',
              last_name: 'Doe'
            }
          }
        },
        patient: {
          id: true
        }
      }
    });
  });

  it('includes phone when provided', async () => {
    mockOrchestrationMutation.mockResolvedValueOnce({
      upsertPatient: {
        patient: { id: 'patient-123' }
      }
    });

    await upsertAwellPatientStep({
      salesforceLeadId: 'lead-456',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+19175551234'
    });

    expect(mockOrchestrationMutation).toHaveBeenCalledWith({
      upsertPatient: {
        __args: {
          input: {
            patient_identifier: expect.any(Object),
            profile: expect.objectContaining({
              phone: '+19175551234'
            })
          }
        },
        patient: expect.any(Object)
      }
    });
  });

  it('includes state in address when provided', async () => {
    mockOrchestrationMutation.mockResolvedValueOnce({
      upsertPatient: {
        patient: { id: 'patient-123' }
      }
    });

    await upsertAwellPatientStep({
      salesforceLeadId: 'lead-456',
      firstName: 'John',
      lastName: 'Doe',
      state: 'CO'
    });

    expect(mockOrchestrationMutation).toHaveBeenCalledWith({
      upsertPatient: {
        __args: {
          input: {
            patient_identifier: expect.any(Object),
            profile: expect.objectContaining({
              address: { state: 'CO' }
            })
          }
        },
        patient: expect.any(Object)
      }
    });
  });

  it('throws when firstName is missing', async () => {
    await expect(
      upsertAwellPatientStep({
        salesforceLeadId: 'lead-456',
        firstName: '',
        lastName: 'Doe'
      })
    ).rejects.toThrow('First name is required');
  });

  it('throws when lastName is missing', async () => {
    await expect(
      upsertAwellPatientStep({
        salesforceLeadId: 'lead-456',
        firstName: 'John',
        lastName: ''
      })
    ).rejects.toThrow('Last name is required');
  });

  it('throws when salesforceLeadId is missing', async () => {
    await expect(
      upsertAwellPatientStep({
        salesforceLeadId: '',
        firstName: 'John',
        lastName: 'Doe'
      })
    ).rejects.toThrow('Salesforce lead ID is required');
  });

  it('throws when no patient ID is returned', async () => {
    mockOrchestrationMutation.mockResolvedValueOnce({
      upsertPatient: {
        patient: { id: null }
      }
    });

    await expect(
      upsertAwellPatientStep({
        salesforceLeadId: 'lead-456',
        firstName: 'John',
        lastName: 'Doe'
      })
    ).rejects.toThrow('Failed to upsert patient');
  });

  it('throws when AWELL_API_KEY is missing', async () => {
    delete process.env.AWELL_API_KEY;

    await expect(
      upsertAwellPatientStep({
        salesforceLeadId: 'lead-456',
        firstName: 'John',
        lastName: 'Doe'
      })
    ).rejects.toThrow('AWELL_API_KEY environment variable is not set');
  });

  it('throws when SALESFORCE_IDENTIFIER_SYSTEM is missing', async () => {
    delete process.env.SALESFORCE_IDENTIFIER_SYSTEM;

    await expect(
      upsertAwellPatientStep({
        salesforceLeadId: 'lead-456',
        firstName: 'John',
        lastName: 'Doe'
      })
    ).rejects.toThrow(
      'SALESFORCE_IDENTIFIER_SYSTEM environment variable is not set'
    );
  });
});

describe('startIntakeCareflowStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AWELL_API_KEY = 'test-api-key';
    process.env.AWELL_ENVIRONMENT = 'sandbox';
    process.env.SALESFORCE_IDENTIFIER_SYSTEM = 'salesforce-system';
    process.env.INTAKE_CAREFLOW_DEFINITION_ID = 'intake-def-123';
  });

  afterEach(() => {
    delete process.env.AWELL_API_KEY;
    delete process.env.AWELL_ENVIRONMENT;
    delete process.env.SALESFORCE_IDENTIFIER_SYSTEM;
    delete process.env.INTAKE_CAREFLOW_DEFINITION_ID;
  });

  it('starts careflow with data points', async () => {
    mockOrchestrationMutation.mockResolvedValueOnce({
      startPathwayWithPatientIdentifier: {
        pathway_id: 'pathway-123',
        patient_id: 'patient-456'
      }
    });

    const result = await startIntakeCareflowStep({
      salesforceLeadId: 'lead-789',
      eventId: 'event-111',
      providerId: 'provider-222',
      confirmationId: 'conf-333'
    });

    expect(result).toEqual({
      careflowId: 'pathway-123',
      patientId: 'patient-456'
    });

    expect(mockOrchestrationMutation).toHaveBeenCalledWith({
      startPathwayWithPatientIdentifier: {
        __args: {
          input: {
            pathway_definition_id: 'intake-def-123',
            patient_identifier: {
              system: 'salesforce-system',
              value: 'lead-789'
            },
            create_patient: true,
            data_points: expect.arrayContaining([
              expect.objectContaining({ value: 'event-111' }),
              expect.objectContaining({ value: 'provider-222' }),
              expect.objectContaining({ value: 'conf-333' })
            ])
          }
        },
        pathway_id: true,
        patient_id: true
      }
    });
  });

  it('throws when INTAKE_CAREFLOW_DEFINITION_ID is missing', async () => {
    delete process.env.INTAKE_CAREFLOW_DEFINITION_ID;

    await expect(
      startIntakeCareflowStep({
        salesforceLeadId: 'lead-789',
        eventId: 'event-111',
        providerId: 'provider-222',
        confirmationId: 'conf-333'
      })
    ).rejects.toThrow(
      'INTAKE_CAREFLOW_DEFINITION_ID environment variable is not set'
    );
  });

  it('throws when salesforceLeadId is missing', async () => {
    await expect(
      startIntakeCareflowStep({
        salesforceLeadId: '',
        eventId: 'event-111',
        providerId: 'provider-222',
        confirmationId: 'conf-333'
      })
    ).rejects.toThrow('Salesforce lead ID is required');
  });

  it('throws when no pathway_id returned', async () => {
    mockOrchestrationMutation.mockResolvedValueOnce({
      startPathwayWithPatientIdentifier: {
        pathway_id: null,
        patient_id: 'patient-456'
      }
    });

    await expect(
      startIntakeCareflowStep({
        salesforceLeadId: 'lead-789',
        eventId: 'event-111',
        providerId: 'provider-222',
        confirmationId: 'conf-333'
      })
    ).rejects.toThrow('Failed to start intake careflow');
  });
});

describe('startReengagementCareflowStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AWELL_API_KEY = 'test-api-key';
    process.env.AWELL_ENVIRONMENT = 'sandbox';
    process.env.SALESFORCE_IDENTIFIER_SYSTEM = 'salesforce-system';
    process.env.REENGAGEMENT_CAREFLOW_DEFINITION_ID = 'reengagement-def-123';
  });

  afterEach(() => {
    delete process.env.AWELL_API_KEY;
    delete process.env.AWELL_ENVIRONMENT;
    delete process.env.SALESFORCE_IDENTIFIER_SYSTEM;
    delete process.env.REENGAGEMENT_CAREFLOW_DEFINITION_ID;
  });

  it('starts re-engagement careflow', async () => {
    mockOrchestrationMutation.mockResolvedValueOnce({
      startPathwayWithPatientIdentifier: {
        pathway_id: 'reengagement-pathway-123'
      }
    });

    const result = await startReengagementCareflowStep({
      salesforceLeadId: 'lead-789'
    });

    expect(result).toEqual({ careflowId: 'reengagement-pathway-123' });

    expect(mockOrchestrationMutation).toHaveBeenCalledWith({
      startPathwayWithPatientIdentifier: {
        __args: {
          input: {
            pathway_definition_id: 'reengagement-def-123',
            patient_identifier: {
              system: 'salesforce-system',
              value: 'lead-789'
            },
            create_patient: true
          }
        },
        pathway_id: true
      }
    });
  });

  it('throws when REENGAGEMENT_CAREFLOW_DEFINITION_ID is missing', async () => {
    delete process.env.REENGAGEMENT_CAREFLOW_DEFINITION_ID;

    await expect(
      startReengagementCareflowStep({
        salesforceLeadId: 'lead-789'
      })
    ).rejects.toThrow(
      'REENGAGEMENT_CAREFLOW_DEFINITION_ID environment variable is not set'
    );
  });

  it('throws when no pathway_id returned', async () => {
    mockOrchestrationMutation.mockResolvedValueOnce({
      startPathwayWithPatientIdentifier: {
        pathway_id: null
      }
    });

    await expect(
      startReengagementCareflowStep({
        salesforceLeadId: 'lead-789'
      })
    ).rejects.toThrow('Failed to start re-engagement careflow');
  });
});

describe('haltReengagementCareflowsStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AWELL_API_KEY = 'test-api-key';
    process.env.AWELL_ENVIRONMENT = 'sandbox';
    process.env.REENGAGEMENT_CAREFLOW_DEFINITION_ID = 'reengagement-def-123';
  });

  afterEach(() => {
    delete process.env.AWELL_API_KEY;
    delete process.env.AWELL_ENVIRONMENT;
    delete process.env.REENGAGEMENT_CAREFLOW_DEFINITION_ID;
  });

  it('returns early when no definition ID configured', async () => {
    delete process.env.REENGAGEMENT_CAREFLOW_DEFINITION_ID;

    const result = await haltReengagementCareflowsStep({
      patientId: 'patient-123',
      confirmationId: 'conf-456'
    });

    expect(result).toEqual({ stoppedCount: 0, stoppedPathwayIds: [] });
    expect(mockOrchestrationQuery).not.toHaveBeenCalled();
  });

  it('returns empty when no active pathways found', async () => {
    mockOrchestrationQuery.mockResolvedValueOnce({
      pathways: {
        pathways: []
      }
    });

    const result = await haltReengagementCareflowsStep({
      patientId: 'patient-123',
      confirmationId: 'conf-456'
    });

    expect(result).toEqual({ stoppedCount: 0, stoppedPathwayIds: [] });
  });

  it('stops all active re-engagement pathways', async () => {
    mockOrchestrationQuery.mockResolvedValueOnce({
      pathways: {
        pathways: [
          { id: 'pathway-1', status: 'active', title: 'Re-engagement 1' },
          { id: 'pathway-2', status: 'active', title: 'Re-engagement 2' }
        ]
      }
    });

    mockOrchestrationMutation
      .mockResolvedValueOnce({ stopPathway: { success: true } })
      .mockResolvedValueOnce({ stopPathway: { success: true } });

    const result = await haltReengagementCareflowsStep({
      patientId: 'patient-123',
      confirmationId: 'conf-456'
    });

    expect(result).toEqual({
      stoppedCount: 2,
      stoppedPathwayIds: ['pathway-1', 'pathway-2']
    });

    // Check that stop was called with correct reason
    expect(mockOrchestrationMutation).toHaveBeenCalledWith({
      stopPathway: {
        __args: {
          input: {
            pathway_id: 'pathway-1',
            reason: 'Booked appointment, confirmation ID: conf-456'
          }
        },
        success: true
      }
    });
  });

  it('continues on individual pathway stop failure', async () => {
    mockOrchestrationQuery.mockResolvedValueOnce({
      pathways: {
        pathways: [
          { id: 'pathway-1', status: 'active' },
          { id: 'pathway-2', status: 'active' }
        ]
      }
    });

    mockOrchestrationMutation
      .mockRejectedValueOnce(new Error('Stop failed')) // First fails
      .mockResolvedValueOnce({ stopPathway: { success: true } }); // Second succeeds

    const result = await haltReengagementCareflowsStep({
      patientId: 'patient-123',
      confirmationId: 'conf-456'
    });

    // Only the second pathway should be counted as stopped
    expect(result.stoppedCount).toBe(1);
    expect(result.stoppedPathwayIds).toEqual(['pathway-2']);
  });

  it('skips pathways with null ID', async () => {
    mockOrchestrationQuery.mockResolvedValueOnce({
      pathways: {
        pathways: [
          { id: null, status: 'active' },
          { id: 'pathway-2', status: 'active' }
        ]
      }
    });

    mockOrchestrationMutation.mockResolvedValueOnce({
      stopPathway: { success: true }
    });

    const result = await haltReengagementCareflowsStep({
      patientId: 'patient-123',
      confirmationId: 'conf-456'
    });

    // Only pathway-2 should be stopped
    expect(mockOrchestrationMutation).toHaveBeenCalledTimes(1);
    expect(result.stoppedPathwayIds).toEqual(['pathway-2']);
  });

  it('queries for active and starting pathways', async () => {
    mockOrchestrationQuery.mockResolvedValueOnce({
      pathways: { pathways: [] }
    });

    await haltReengagementCareflowsStep({
      patientId: 'patient-123',
      confirmationId: 'conf-456'
    });

    expect(mockOrchestrationQuery).toHaveBeenCalledWith({
      pathways: {
        __args: {
          filters: {
            patient_id: { in: ['patient-123'] },
            status: { in: ['active', 'starting'] },
            pathway_definition_id: { eq: 'reengagement-def-123' }
          }
        },
        pathways: {
          id: true,
          pathway_definition_id: true,
          status: true,
          title: true
        }
      }
    });
  });
});

describe('startHostedActivitySessionStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AWELL_API_KEY = 'test-api-key';
    process.env.AWELL_ENVIRONMENT = 'sandbox';
  });

  afterEach(() => {
    delete process.env.AWELL_API_KEY;
    delete process.env.AWELL_ENVIRONMENT;
  });

  it('starts hosted activity session', async () => {
    mockOrchestrationMutation.mockResolvedValueOnce({
      startHostedActivitySession: {
        session_url: 'https://awell.health/session/abc123'
      }
    });

    const result = await startHostedActivitySessionStep({
      careflowId: 'careflow-123',
      patientId: 'patient-456'
    });

    expect(result).toEqual({
      sessionUrl: 'https://awell.health/session/abc123'
    });

    expect(mockOrchestrationMutation).toHaveBeenCalledWith({
      startHostedActivitySession: {
        __args: {
          input: {
            pathway_id: 'careflow-123',
            stakeholder_id: 'patient-456'
          }
        },
        session_url: true
      }
    });
  });

  it('throws when no session URL returned', async () => {
    mockOrchestrationMutation.mockResolvedValueOnce({
      startHostedActivitySession: {
        session_url: null
      }
    });

    await expect(
      startHostedActivitySessionStep({
        careflowId: 'careflow-123',
        patientId: 'patient-456'
      })
    ).rejects.toThrow('Failed to start hosted activity session');
  });

  it('throws when AWELL_API_KEY is missing', async () => {
    delete process.env.AWELL_API_KEY;

    await expect(
      startHostedActivitySessionStep({
        careflowId: 'careflow-123',
        patientId: 'patient-456'
      })
    ).rejects.toThrow('AWELL_API_KEY environment variable is not set');
  });
});
