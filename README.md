# SOL Scheduling

Patient booking application for SOL Mental Health, built by Awell.

## Purpose

This application is the entry point for patients seeking mental health services at SOL. It captures patient preferences, matches them with appropriate providers, and facilitates appointment booking. After booking, it hands off to Awell care flows for intake and ongoing engagement.

### User Journey

1. **Onboarding** — State, service type (therapy/psychiatry), phone number, insurance
2. **Provider Selection** — Browse and filter matched providers
3. **Time Selection** — Select available appointment slot
4. **Confirmation** — Review booking and begin intake flow

### System Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    BOOKING APPLICATION                       │
│  Onboarding → Provider Selection → Booking → Confirmation   │
└────────────┬──────────────────────────────────┬─────────────┘
             │                                  │
             │ Creates/Updates Lead             │ User clicks "Begin Intake"
             ▼                                  ▼
┌────────────────────────┐          ┌────────────────────────┐
│      SALESFORCE        │          │     AWELL CARE FLOWS   │
│  - Lead created on     │──────────│  - Re-engagement flow  │
│    phone number entry  │ Webhook  │    (recover drop-offs) │
│  - Lead updated on     │──────────│  - Intake flow         │
│    booking completion  │ Stops    │    (qualify + prepare) │
└────────────────────────┘          └────────────────────────┘
```

**Lead Lifecycle:**
- Lead created when phone number is entered (fire-and-forget)
- Lead updated with insurance during onboarding
- Lead updated with booking details on confirmation
- Salesforce events trigger/stop Awell re-engagement flow

### Analytics (PostHog)

- User identification linked to Salesforce Lead ID
- Event tracking: `lead_created`, `appointment_booked`, `waitlist_signup`
- API timing metrics for performance monitoring
- Feature flags control onboarding question configuration

## Quick Start

```bash
pnpm install
cp apps/scheduling-app/.env.example apps/scheduling-app/.env.local
# Configure SOL_API_KEY, SALESFORCE_*, POSTHOG_* credentials
pnpm dev:app
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details including:
- Complete swimlane diagram of user flow and API calls
- External API integrations (SOL, Salesforce, PostHog)
- Data storage patterns
- Workflow implementation

## Deployment

- **App**: [sol-scheduling.vercel.app](https://sol-scheduling.vercel.app) — auto-deploys on merge to `main`
- **Package**: [@awell-health/sol-scheduling](https://www.npmjs.com/package/@awell-health/sol-scheduling) — reusable scheduling components

## Monorepo Structure

```
apps/scheduling-app/    # Next.js booking application (this project)
packages/scheduler/     # Reusable React scheduling components (npm package)
```

## Ownership

| Area | Notes |
|------|-------|
| Booking Application | Next.js app, Vercel hosting |
| Salesforce Integration | Lead create/update actions |
| Re-engagement Flow | Awell care flow — recovers drop-offs via automated outreach |
| Intake Flow | Awell care flow — qualifies patients, prepares for appointment |
| Analytics | PostHog — user tracking, feature flags, API metrics |
