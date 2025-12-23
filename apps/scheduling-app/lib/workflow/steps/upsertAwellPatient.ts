import { AwellSdk, type Environment } from '@awell-health/awell-sdk';

/**
 * Input for upsertAwellPatient step
 */
export interface UpsertAwellPatientInput {
  /** Salesforce lead ID - used as patient identifier */
  salesforceLeadId: string;
  /** Patient's first name (required) */
  firstName: string;
  /** Patient's last name (required) */
  lastName: string;
  /** Patient's phone number */
  phone?: string;
  /** Patient's state code (e.g., "CA", "NY") */
  state?: string;
}

/**
 * Result of upsertAwellPatient step
 */
export interface UpsertAwellPatientResult {
  /** Awell patient ID */
  patientId: string;
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
 * Upsert a patient in Awell.
 * Creates or updates the patient with the provided information.
 * Requires first_name, last_name, and patient_identifier.
 * Optionally includes phone and address.state.
 * 
 * Marked as a workflow step for durability.
 */
export async function upsertAwellPatientStep(
  input: UpsertAwellPatientInput
): Promise<UpsertAwellPatientResult> {
  "use step";

  console.log('[upsertAwellPatientStep] Upserting patient:', {
    salesforceLeadId: input.salesforceLeadId,
    firstName: input.firstName,
    lastName: input.lastName,
    hasPhone: !!input.phone,
    state: input.state,
  });

  if (!input.firstName) {
    throw new Error('[upsertAwellPatientStep] First name is required');
  }

  if (!input.lastName) {
    throw new Error('[upsertAwellPatientStep] Last name is required');
  }

  if (!input.salesforceLeadId) {
    throw new Error('[upsertAwellPatientStep] Salesforce lead ID is required');
  }

  const awell = getAwellClient();

  // Build the patient profile data
  const profile: { first_name: string; last_name: string } & Record<string, unknown> = {
    first_name: input.firstName,
    last_name: input.lastName,
  };

  // Add phone if provided
  if (input.phone) {
    profile.phone = input.phone;
  }

  // Add address.state if provided
  if (input.state) {
    profile.address = {
      state: input.state,
    };
  }

  const response = await awell.orchestration.mutation({
    upsertPatient: {
      __args: {
        input: {
          patient_identifier: {
            system: getSalesforceIdentifierSystem(),
            value: input.salesforceLeadId,
          },
          profile,
        },
      },
      patient: {
        id: true
      }
    },
  });

  const patientId = response.upsertPatient?.patient?.id;

  if (!patientId) {
    console.error('[upsertAwellPatientStep] Failed to upsert patient:', {
      salesforceLeadId: input.salesforceLeadId,
      response,
    });
    throw new Error('Failed to upsert patient - no patient ID returned');
  }

  console.log('[upsertAwellPatientStep] Patient upserted:', {
    salesforceLeadId: input.salesforceLeadId,
    patientId,
  });

  return { patientId };
}

