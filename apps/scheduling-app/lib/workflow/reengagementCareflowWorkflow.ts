import {
  startReengagementCareflowStep,
} from './steps/startReengagementCareflow';

/**
 * Input for reengagementCareflowWorkflow
 */
export interface ReengagementCareflowWorkflowInput {
  /** Salesforce lead ID */
  salesforceLeadId: string;
  /** Phone number */
  phone: string;
  /** State code (e.g., 'NY', 'CA') */
  state?: string;
}

/**
 * Result of reengagementCareflowWorkflow
 */
export interface ReengagementCareflowWorkflowResult {
  /** Awell careflow ID */
  careflowId: string;
}

/**
 * Re-engagement careflow workflow.
 * 
 * Kicked off after a new Salesforce lead is created.
 * Ensures that both the Awell patient upsert and careflow start
 * are executed durably.
 * 
 * Steps:
 * 1. Upsert patient in Awell (creates or updates, populates profile)
 * 2. Start the re-engagement careflow
 * 
 * @see https://useworkflow.dev/
 */
export async function reengagementCareflowWorkflow(
  input: ReengagementCareflowWorkflowInput
): Promise<ReengagementCareflowWorkflowResult> {
  "use workflow";

  console.log('[reengagementCareflowWorkflow] Starting:', {
    salesforceLeadId: input.salesforceLeadId,
    hasPhone: !!input.phone,
    state: input.state,
  });

  // Step 2: Start the re-engagement careflow
  const { careflowId } = await startReengagementCareflowStep({
    salesforceLeadId: input.salesforceLeadId,
  });

  console.log('[reengagementCareflowWorkflow] Completed:', {
    salesforceLeadId: input.salesforceLeadId,
    careflowId,
  });

  return {
    careflowId,
  };
}

