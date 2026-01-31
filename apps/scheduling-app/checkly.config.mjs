import { defineConfig } from 'checkly';
import { Frequency } from 'checkly/constructs';

/**
 * Checkly configuration for SOL Scheduling App
 *
 * Run checks with: npx checkly test
 * Deploy checks with: npx checkly deploy
 */
export default defineConfig({
  projectName: 'SOL Scheduling App',
  logicalId: 'sol-scheduling',
  repoUrl: 'https://github.com/awell-health/sol-scheduling',
  checks: {
    // Default settings for all checks
    activated: true,
    muted: false,
    runtimeId: '2025.04',
    frequency: Frequency.EVERY_10M,
    locations: ['us-east-1', 'eu-central-1'],
    tags: ['scheduling', 'sol'],
    checkMatch: '**/__checks__/**/*.check.ts',
    ignoreDirectoriesMatch: [],
    browserChecks: {
      frequency: Frequency.EVERY_10M,
      testMatch: '**/__checks__/**/*.spec.ts'
    }
  },
  cli: {
    runLocation: 'us-east-1'
  }
});
