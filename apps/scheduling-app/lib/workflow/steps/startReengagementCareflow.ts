import { AwellSdk, type Environment } from '@awell-health/awell-sdk';

/**
 * Input for startReengagementCareflow step
 */
export interface StartReengagementCareflowInput {
  /** Salesforce lead ID (for logging/debugging) */
  salesforceLeadId: string;
}

/**
 * Result of startReengagementCareflow step
 */
export interface StartReengagementCareflowResult {
  /** Awell careflow ID */
  careflowId: string;
}

function getAwellClient() {
  const apiKey = process.env.AWELL_API_KEY;
  const environment = (process.env.AWELL_ENVIRONMENT || 'sandbox') as Environment;

  if (!apiKey) {
    throw new Error('AWELL_API_KEY environment variable is not set');
  }

  return new AwellSdk({
    apiKey,
    environment,
  });
}

function getSalesforceIdentifierSystem() {
  const salesforceIdentifierSystem = process.env.SALESFORCE_IDENTIFIER_SYSTEM;
  if (!salesforceIdentifierSystem) {
    throw new Error('SALESFORCE_IDENTIFIER_SYSTEM environment variable is not set');
  }
  return salesforceIdentifierSystem;
}

/**
 * Start the re-engagement careflow for a patient.
 * 
 * Marked as a workflow step for durability.
 */
export async function startReengagementCareflowStep(
  input: StartReengagementCareflowInput
): Promise<StartReengagementCareflowResult> {
  "use step";

  const definitionId = process.env.REENGAGEMENT_CAREFLOW_DEFINITION_ID;

  if (!definitionId) {
    throw new Error('REENGAGEMENT_CAREFLOW_DEFINITION_ID environment variable is not set');
  }

  const awell = getAwellClient();

  console.log('[startReengagementCareflowStep] Starting careflow:', {
    salesforceLeadId: input.salesforceLeadId,
    definitionId,
  });

  const response = await awell.orchestration.mutation({
    startPathwayWithPatientIdentifier: {
      __args: {
        input: {
          pathway_definition_id: definitionId,
          patient_identifier: {
            system: getSalesforceIdentifierSystem(),
            value: input.salesforceLeadId,
          },
          create_patient: true
        },
      },
      pathway_id: true
    },
  });

  const careflowId = response.startPathwayWithPatientIdentifier?.pathway_id;

  if (!careflowId) {
    console.error('[startReengagementCareflowStep] Failed to start careflow:', {
      salesforceLeadId: input.salesforceLeadId,
      response,
    });
    throw new Error('Failed to start re-engagement careflow - no careflow ID returned');
  }

  console.log('[startReengagementCareflowStep] Careflow started:', {
    salesforceLeadId: input.salesforceLeadId,
    careflowId,
  });

  return { careflowId };
}

