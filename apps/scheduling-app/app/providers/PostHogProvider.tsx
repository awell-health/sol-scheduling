"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: '2025-05-24',
      capture_exceptions: true, // This enables capturing exceptions using Error Tracking
      debug: process.env.NODE_ENV === "development",
      sanitize_properties: (properties) => {
        // Remove or mask PHI (Protected Health Information) fields
        // Fields marked with data-phi="true" should not be captured
        const phiFields = ['firstName', 'lastName', 'phone', 'state', 'email', 'address'];
        const sanitized: Record<string, any> = {};
        
        for (const [key, value] of Object.entries(properties)) {
          // Check if this is a PHI field
          if (phiFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
            // Mask the value instead of removing it completely (useful for debugging)
            sanitized[key] = '[PHI]';
          } else {
            sanitized[key] = value;
          }
        }
        
        return sanitized;
      },
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}