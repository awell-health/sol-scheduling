/**
 * Stub for posthog-node in Storybook
 *
 * posthog-node is a server-only package. This stub satisfies imports.
 */

export class PostHog {
  constructor(_apiKey: string, _options?: Record<string, unknown>) {}

  capture() {}
  identify() {}
  alias() {}
  groupIdentify() {}
  flush() {}
  shutdown() {}
}

export default PostHog;
