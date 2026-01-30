/**
 * Stub for workflow and workflow/api in Storybook
 *
 * The workflow package is server-only and uses Node.js AsyncLocalStorage.
 * This stub provides empty exports to satisfy imports in Storybook.
 */

// workflow/api exports
export async function start(_workflow: unknown, _args: unknown[]) {
  return {
    runId: 'stub-run-id',
    workflowId: 'stub-workflow-id'
  };
}

export async function getRun(_runId: string) {
  return {
    status: 'completed',
    result: null
  };
}

// workflow exports
export function getWorkflowMetadata() {
  return {
    runId: 'stub-run-id',
    workflowId: 'stub-workflow-id'
  };
}

export function getWritable() {
  return {
    write: () => {},
    close: () => {}
  };
}

export default { start, getRun, getWorkflowMetadata, getWritable };
