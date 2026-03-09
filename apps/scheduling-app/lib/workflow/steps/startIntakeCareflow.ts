import { AwellSdk, type Environment } from '@awell-health/awell-sdk';

/**
 * Input for startIntakeCareflow step
 */
export interface StartIntakeCareflowInput {
  /** Salesforce lead ID - used as patient identifier */
  salesforceLeadId: string;
  /** SOL event ID for baseline info */
  eventId: string;
  /** SOL provider ID for baseline info */
  providerId: string;
  /** Workflow run ID for baseline info - allows returning to confirmation page */
  confirmationId: string;
}

/**
 * Result of startIntakeCareflow step
 */
export interface StartIntakeCareflowResult {
  /** Awell careflow ID (pathway_id) */
  careflowId: string;
  /** Awell patient ID */
  patientId: string;
}

function getAwellClient() {
  const apiKey = process.env.AWELL_API_KEY;
  const environment = (process.env.AWELL_ENVIRONMENT ||
    'sandbox') as Environment;

  if (!apiKey) {
    throw new Error('AWELL_API_KEY environment variable is not set');
  }

  return new AwellSdk({
    apiKey,
    environment
  });
}

function getSalesforceIdentifierSystem() {
  const salesforceIdentifierSystem = process.env.SALESFORCE_IDENTIFIER_SYSTEM;
  if (!salesforceIdentifierSystem) {
    throw new Error(
      'SALESFORCE_IDENTIFIER_SYSTEM environment variable is not set'
    );
  }
  return salesforceIdentifierSystem;
}

/**
 * Start the intake careflow for a patient.
 * Uses Salesforce lead ID as the patient identifier.
 *
 * Marked as a workflow step for durability.
 */
export async function startIntakeCareflowStep(
  input: StartIntakeCareflowInput
): Promise<StartIntakeCareflowResult> {
  'use step';

  // Read env vars at runtime (not module load time) for testability
  const definitionId = process.env.INTAKE_CAREFLOW_DEFINITION_ID;
  const eventIdDataPointDefinitionId =
    process.env.INTAKE_CAREFLOW_DPD_BOOKED_EVENT_ID;
  const providerIdDataPointDefinitionId =
    process.env.INTAKE_CAREFLOW_DPD_PROVIDER_ID;
  const confirmationIdDataPointDefinitionId =
    process.env.INTAKE_CAREFLOW_DPD_BOOKING_CONFIRMATION_ID;

  if (
    !eventIdDataPointDefinitionId ||
    !providerIdDataPointDefinitionId ||
    !confirmationIdDataPointDefinitionId ||
    !definitionId
  ) {
    throw new Error(
      '[startIntakeCareflowStep] INTAKE_CAREFLOW_DPD_BOOKED_EVENT_ID, INTAKE_CAREFLOW_DPD_PROVIDER_ID, INTAKE_CAREFLOW_DPD_BOOKING_CONFIRMATION_ID, or INTAKE_CAREFLOW_DEFINITION_ID environment variable is not set'
    );
  }

  console.log('[startIntakeCareflowStep] Starting intake careflow:', {
    salesforceLeadId: input.salesforceLeadId,
    eventId: input.eventId,
    providerId: input.providerId,
    confirmationId: input.confirmationId,
    definitionId
  });

  const awell = getAwellClient();

  if (!definitionId) {
    throw new Error(
      '[startIntakeCareflowStep] INTAKE_CAREFLOW_DEFINITION_ID environment variable is not set'
    );
  }

  if (!input.salesforceLeadId) {
    throw new Error(
      '[startIntakeCareflowStep] Salesforce lead ID is required but was not provided'
    );
  }

  const response = await awell.orchestration.mutation({
    startPathwayWithPatientIdentifier: {
      __args: {
        input: {
          pathway_definition_id: definitionId,
          patient_identifier: {
            system: getSalesforceIdentifierSystem(),
            value: input.salesforceLeadId
          },
          create_patient: true,
          data_points: [
            {
              data_point_definition_id: eventIdDataPointDefinitionId,
              value: input.eventId
            },
            {
              data_point_definition_id: providerIdDataPointDefinitionId,
              value: input.providerId
            },
            {
              data_point_definition_id: confirmationIdDataPointDefinitionId,
              value: input.confirmationId
            }
          ]
        }
      },
      pathway_id: true,
      patient_id: true
    }
  });

  const careflowId = response.startPathwayWithPatientIdentifier?.pathway_id;
  const patientId = response.startPathwayWithPatientIdentifier?.patient_id;

  if (!careflowId || !patientId) {
    console.error('[startIntakeCareflowStep] Failed to start careflow:', {
      salesforceLeadId: input.salesforceLeadId,
      response
    });
    throw new Error(
      'Failed to start intake careflow - missing careflowId or patientId'
    );
  }

  console.log('[startIntakeCareflowStep] Careflow started:', {
    salesforceLeadId: input.salesforceLeadId,
    careflowId,
    patientId
  });

  return { careflowId, patientId };
}
