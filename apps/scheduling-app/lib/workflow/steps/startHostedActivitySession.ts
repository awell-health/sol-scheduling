import { AwellSdk, type Environment } from '@awell-health/awell-sdk';

/**
 * Input for startHostedActivitySession step
 */
export interface StartHostedActivitySessionInput {
  /** Awell careflow ID (pathway_id) */
  careflowId: string;
  /** Awell patient ID (used as stakeholder_id) */
  patientId: string;
}

/**
 * Result of startHostedActivitySession step
 */
export interface StartHostedActivitySessionResult {
  /** Hosted pages session URL for the patient to complete intake forms */
  sessionUrl: string;
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

/**
 * Start a hosted activity session for the patient to complete intake forms.
 * 
 * Marked as a workflow step for durability.
 */
export async function startHostedActivitySessionStep(
  input: StartHostedActivitySessionInput
): Promise<StartHostedActivitySessionResult> {
  "use step";

  console.log('[startHostedActivitySessionStep] Starting hosted activity session:', {
    careflowId: input.careflowId,
    patientId: input.patientId,
  });

  const awell = getAwellClient();

  const response = await awell.orchestration.mutation({
    startHostedActivitySession: {
      __args: {
        input: {
          pathway_id: input.careflowId,
          stakeholder_id: input.patientId,
        },
      },
      session_url: true,
    },
  });

  const sessionUrl = response.startHostedActivitySession?.session_url;

  if (!sessionUrl) {
    console.error('[startHostedActivitySessionStep] Failed to start session:', {
      careflowId: input.careflowId,
      patientId: input.patientId,
      response,
    });
    throw new Error('Failed to start hosted activity session - no session URL returned');
  }

  console.log('[startHostedActivitySessionStep] Session started:', {
    careflowId: input.careflowId,
    patientId: input.patientId,
    sessionUrl
  });

  return { sessionUrl };
}

