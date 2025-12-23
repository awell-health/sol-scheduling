import { AwellSdk, type Environment } from '@awell-health/awell-sdk';

/**
 * Input for haltReengagementCareflows step
 */
export interface HaltReengagementCareflowsInput {
  /** Awell patient ID */
  patientId: string;
  /** Confirmation ID (workflow runId) for the stop reason */
  confirmationId: string;
}

/**
 * Result of haltReengagementCareflows step
 */
export interface HaltReengagementCareflowsResult {
  /** Number of pathways stopped */
  stoppedCount: number;
  /** IDs of stopped pathways */
  stoppedPathwayIds: string[];
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
 * Find and stop any active re-engagement care flows for a patient.
 * 
 * This step:
 * 1. Fetches all pathways for the patient
 * 2. Filters for active re-engagement care flows
 * 3. Stops each one with the booking confirmation ID as the reason
 * 
 * Marked as a workflow step for durability.
 */
export async function haltReengagementCareflowsStep(
  input: HaltReengagementCareflowsInput
): Promise<HaltReengagementCareflowsResult> {
  "use step";

  const reengagementDefinitionId = process.env.REENGAGEMENT_CAREFLOW_DEFINITION_ID;

  if (!reengagementDefinitionId) {
    console.log('[haltReengagementCareflowsStep] No REENGAGEMENT_CAREFLOW_DEFINITION_ID configured, skipping');
    return { stoppedCount: 0, stoppedPathwayIds: [] };
  }

  console.log('[haltReengagementCareflowsStep] Finding re-engagement careflows for patient:', {
    patientId: input.patientId,
    reengagementDefinitionId,
  });

  const awell = getAwellClient();

  // Type for pathway info from API response
  type PathwayInfo = {
    id?: string | null;
    pathway_definition_id?: string | null;
    status?: string | null;
    title?: string | null;
  };

  // Step 1: Get all active re-engagement pathways for this patient
  const pathwaysResponse = await awell.orchestration.query({
    pathways: {
      __args: {
        filters: {
          patient_id: {
            in: [input.patientId],
          },
          status: {
            in: ['active', 'starting'],
          },
          pathway_definition_id: {
            eq: reengagementDefinitionId,
          },
        },
      },
      pathways: {
        id: true,
        pathway_definition_id: true,
        status: true,
        title: true,
      },
    },
  });

  const pathways = (pathwaysResponse.pathways?.pathways ?? []) as PathwayInfo[];

  if (pathways.length === 0) {
    console.log('[haltReengagementCareflowsStep] No active re-engagement careflows found');
    return { stoppedCount: 0, stoppedPathwayIds: [] };
  }

  console.log('[haltReengagementCareflowsStep] Found re-engagement careflows to stop:', {
    patientId: input.patientId,
    count: pathways.length,
    pathways: pathways.map((p) => ({ 
      id: p.id, 
      status: p.status,
      title: p.title,
    })),
  });

  // Step 2: Stop each re-engagement pathway
  const stoppedPathwayIds: string[] = [];
  const stopReason = `Booked appointment, confirmation ID: ${input.confirmationId}`;

  for (const pathway of pathways) {
    if (!pathway.id) continue;

    try {
      console.log('[haltReengagementCareflowsStep] Stopping pathway:', {
        pathwayId: pathway.id,
        reason: stopReason,
      });

      await awell.orchestration.mutation({
        stopPathway: {
          __args: {
            input: {
              pathway_id: pathway.id,
              reason: stopReason,
            },
          },
          success: true,
        },
      });

      stoppedPathwayIds.push(pathway.id);
      console.log('[haltReengagementCareflowsStep] Stopped pathway:', pathway.id);
    } catch (error) {
      console.error('[haltReengagementCareflowsStep] Failed to stop pathway:', {
        pathwayId: pathway.id,
        error,
      });
      // Continue with other pathways even if one fails
    }
  }

  console.log('[haltReengagementCareflowsStep] Completed:', {
    stoppedCount: stoppedPathwayIds.length,
    stoppedPathwayIds,
  });

  return {
    stoppedCount: stoppedPathwayIds.length,
    stoppedPathwayIds,
  };
}

