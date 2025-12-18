# SOL Scheduling App - Architecture & User Flow

This document describes the user flow and external API calls in the SOL Scheduling App.

## Swimlane Diagram

```
title: SOL Scheduling App - User Flow & External Calls

_: **1. ONBOARDING FLOW** (/onboarding → /providers)

User -> App: Visit /providers
App -> localStorage: Read preferences (sol.scheduling)
note: All onboarding questions are mandatory

_: State Question
User -> App: Select state (or use location)
App --> Nominatim API: [Optional] Reverse geocoding
note: Uses OpenStreetMap API to detect state from GPS coordinates

_: Service Question
User -> App: Select service modality (Therapy, Psychiatric, etc.)

_: Phone Question
User -> App: Enter phone number
App -> Salesforce: createLeadAction()
note: Fire-and-forget, non-blocking
App -> PostHog: identify() with salesforce_lead_id
App -> PostHog: capture('lead_created')
App -> localStorage: Store lead ID (keyed by phone hash)

_: Insurance Question
User -> App: Select insurance carrier
App -> Salesforce: updateLeadAction(insurance)
note: Fire-and-forget, non-blocking

_: State Validation
App -> App: Check if state is in supported list
if: State NOT supported
  App -> User: Redirect to /not-available
end

_: **2. PROVIDER SELECTION** (/providers)

App -> SOL API: getProvidersAction(filters)
note: POST /api/v2/provider
SOL API -> App: Provider list with availability
App -> localStorage: Write preferences (sol.scheduling)
User -> App: Apply filters (age, modality, delivery method, etc.)
App -> SOL API: getProvidersAction(new filters)
User -> App: Select provider card
App -> User: Navigate to /providers/[providerId]

_: **3. PROVIDER DETAIL & BOOKING** (/providers/[id])

App -> SOL API: getProviderAction(providerId)
note: GET /api/provider/info?providerId=X
App -> SOL API: getAvailabilityAction(providerId)
note: POST /api/event/list
User -> App: Select time slot
User -> App: Choose location type (if both available)
User -> App: Submit booking

App -> SOL API: bookAppointmentAction()
note: POST /api/event/book
App -> PostHog: capture('api_call_booking')

_: Post-Booking Workflow (fire-and-forget)
App -> postBookingWorkflow: Trigger async workflow
postBookingWorkflow -> SOL API: getEventDetailsStep()
note: GET /api/event?eventId=X&providerId=Y
postBookingWorkflow -> Salesforce: updateLeadStep()
note: Updates lead with booking details (Status: 'Appt Selected')

App -> User: Redirect to /confirmation

_: **4. CONFIRMATION** (/confirmation)

App -> User: Display booking summary from URL params
note: Static page - no external API calls
User -> App: Click "Begin intake" (optional)
App -> External: Redirect to intake form URL

_: **5. NOT AVAILABLE FLOW** (/not-available)

User -> App: Submit phone for waitlist
App -> PostHog: capture('waitlist_signup')
note: Currently captures intent only - no Salesforce integration yet
```

## Key Components

### External APIs

| Service | Purpose | Endpoints Used |
|---------|---------|----------------|
| **SOL API** | Provider matching & scheduling | `/api/v2/provider`, `/api/provider/info`, `/api/event/list`, `/api/event/book`, `/api/event` |
| **Salesforce** | Lead management | Create lead, Update lead (insurance, booking details) |
| **PostHog** | Analytics & feature flags | `identify()`, `capture()`, feature flag payloads |
| **Nominatim** | Reverse geocoding | Optional - detect state from GPS |

### Data Storage

| Storage | Key | Purpose |
|---------|-----|---------|
| localStorage | `sol.scheduling` | Onboarding preferences (state, service, phone, insurance) |
| localStorage | `_slc_{phoneHash}` | Salesforce lead ID (keyed by phone number hash) |

### Workflows

The app uses a workflow pattern for post-booking operations:

1. **`postBookingWorkflow`** - Triggered after successful booking (fire-and-forget)
   - **Step 1**: `getEventDetailsStep` - Fetch event details from SOL API
   - **Step 2**: `updateLeadStep` - Update Salesforce lead with booking details

### Feature Flags (PostHog)

No feature flags are currently used. All onboarding questions are mandatory.

## File Structure

```
apps/scheduling-app/
├── app/
│   ├── providers/
│   │   ├── _lib/
│   │   │   ├── onboarding/     # Onboarding context, storage, types
│   │   │   └── salesforce/     # Lead actions, storage
│   │   ├── components/
│   │   │   └── OnboardingFlow/ # Question components
│   │   ├── [providerId]/       # Provider detail page
│   │   ├── actions.ts          # Server actions (getProviders, bookAppointment, etc.)
│   │   └── page.tsx            # Provider list page
│   ├── confirmation/           # Booking confirmation page
│   ├── not-available/          # Waitlist page for unsupported states
│   └── onboarding/             # Onboarding entry point
├── lib/
│   ├── salesforce/             # Salesforce client
│   ├── workflow/               # Post-booking workflow
│   │   ├── steps/
│   │   │   ├── getEventDetails.ts
│   │   │   └── updateLead.ts
│   │   └── postBookingWorkflow.ts
│   └── sol-utils.ts            # SOL API utilities
```

