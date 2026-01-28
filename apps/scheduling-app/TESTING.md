# Testing Infrastructure

This document describes the testing infrastructure set up for the scheduling-app.

## Overview

The testing suite consists of three layers:

1. **Unit/Integration Tests** - Vitest with React Testing Library
2. **UI Component Documentation** - Storybook with interaction tests
3. **End-to-End Tests** - Playwright with custom fixtures

## Quick Start

```bash
# Unit tests
pnpm test              # Run all tests once
pnpm test:watch        # Watch mode for development
pnpm test:coverage     # Generate coverage report

# Storybook
pnpm storybook         # Start dev server on http://localhost:6006
pnpm build-storybook   # Build static Storybook

# E2E tests
pnpm test:e2e          # Run Playwright tests (requires dev server)
pnpm test:ui           # Run with Playwright UI mode
```

## Directory Structure

```
apps/scheduling-app/
├── .storybook/              # Storybook configuration
│   ├── main.ts              # Framework, addons, stories paths
│   └── preview.ts           # Global decorators, parameters, MSW init
├── mocks/                   # MSW mock infrastructure
│   ├── browser.ts           # Browser worker for Storybook
│   ├── fixtures.ts          # Mock data (providers, availability, etc.)
│   ├── handlers.ts          # API route handlers
│   ├── index.ts             # Barrel exports
│   └── server.ts            # Node.js server for Vitest
├── __checks__/fixtures/     # Playwright test fixtures
│   ├── api.fixture.ts       # Network-level API mocking
│   ├── index.ts             # Combined test fixture
│   ├── localStorage.fixture.ts
│   └── salesforce.fixture.ts
├── lib/__tests__/           # Unit tests for lib/
├── app/**/__tests__/        # Unit tests for app/ (to be created)
├── tests/                   # Playwright E2E tests
│   └── example.spec.ts      # Example E2E test template
├── vitest.config.ts         # Vitest configuration
├── vitest.setup.ts          # Test setup (MSW, Testing Library)
└── playwright.config.ts     # Playwright configuration
```

## Unit Tests (Vitest)

### Configuration

- **Environment**: jsdom
- **Global setup**: MSW server starts before tests, resets between tests
- **Path aliases**: `@/` maps to project root (matches tsconfig)

### Writing Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Using MSW in Tests

The MSW server is automatically started in `vitest.setup.ts`. To override handlers for specific tests:

```typescript
import { server } from '@/mocks/server';
import { createErrorHandler } from '@/mocks/handlers';

it('handles API errors', async () => {
  server.use(
    createErrorHandler('/api/v2/provider', 500, 'Internal Server Error')
  );
  // ... test error handling
});
```

### Available Mock Data

Import from `@/mocks/fixtures`:

- `mockProviders` - Array of provider data
- `mockProviderDetails` - Provider details by ID
- `mockAvailability` - Availability slots
- `mockBookingResponse` - Success/error booking responses
- `mockOnboardingData` - Pre-filled onboarding localStorage data
- `mockWorkflowProgress` - Workflow step progress states

## Storybook

### Configuration

- **Framework**: `@storybook/react-vite` (Vite-based for fast builds)
- **Addons**: essentials, interactions, a11y
- **MSW**: Automatically initialized in preview for API mocking

### Writing Stories

```typescript
// components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Click me',
    variant: 'default',
  },
};

export const WithInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};
```

### Story Locations

Stories should be co-located with components:
- `components/ui/*.stories.tsx` - Base UI components
- `app/providers/components/*.stories.tsx` - Feature components

## Playwright E2E Tests

### Configuration

- **Base URL**: `http://localhost:3000` (configurable via `PLAYWRIGHT_BASE_URL`)
- **Web Server**: Auto-starts `pnpm dev` before tests
- **Browsers**: Chromium, Firefox, WebKit + Mobile Chrome/Safari
- **Artifacts**: Screenshots and video on failure

### Test Fixtures

Import the combined fixture for full functionality:

```typescript
import { test, expect, mockOnboardingData } from '../__checks__/fixtures';

test('completes booking flow', async ({ 
  page, 
  localStorage,    // localStorage helper
  apiMock,         // API mocking helper
  salesforce,      // Salesforce API client (requires env vars)
}) => {
  // Set up API mocks
  await apiMock.setupMocks();
  
  // Pre-seed localStorage to skip onboarding
  await page.goto('/');
  await localStorage.setOnboardingData(mockOnboardingData.complete);
  
  // Navigate and test
  await page.goto('/providers');
  await expect(page.getByText('Sarah Johnson')).toBeVisible();
});
```

### API Mocking in E2E

```typescript
test('shows error on booking failure', async ({ page, apiMock }) => {
  // Configure mock behavior
  apiMock.configure({ bookingError: true });
  await apiMock.setupMocks();
  
  // ... test error UI
});
```

Available mock configurations:
- `emptyProviders: true` - Return empty provider list
- `noAvailability: true` - Return no available slots
- `bookingError: true` - Simulate booking failure
- `networkError: true` - Simulate network failure
- `delay: number` - Add artificial delay (ms)

### localStorage Helper

```typescript
// Read onboarding data
const data = await localStorage.getOnboardingData();

// Set onboarding data
await localStorage.setOnboardingData({ state: 'CO', service: 'medication' });

// Assert expectations
await localStorage.expectOnboardingContains({ state: 'CO' });
```

## Phase 1 Tasks (Next Steps)

The foundation is complete. Phase 1 involves writing actual tests:

### Unit Tests to Write
- [ ] `lib/workflow/__tests__/` - Workflow step tests
- [ ] `app/providers/__tests__/actions.test.ts` - Server action tests
- [ ] `app/hooks/__tests__/` - Hook tests (useBookingWorkflow, etc.)
- [ ] `lib/__tests__/sol-utils.test.ts` - Utility function tests

### Storybook Stories to Create
- [ ] `components/ui/*.stories.tsx` - Button, Input, Select, Calendar, etc.
- [ ] `app/providers/components/*.stories.tsx` - ProviderCard, Filters, etc.
- [ ] `app/providers/[providerId]/components/*.stories.tsx` - Booking components
- [ ] `app/providers/components/OnboardingFlow/*.stories.tsx` - Onboarding steps

### E2E Tests to Write
- [ ] `tests/onboarding.spec.ts` - Complete onboarding flow
- [ ] `tests/provider-selection.spec.ts` - Filtering and selection
- [ ] `tests/booking.spec.ts` - Booking workflow (mocked)
- [ ] `tests/confirmation.spec.ts` - Confirmation page

## Guiding Principle

**If a unit requires extensive mocking, it's a code smell.**

When writing tests, if you need to mock more than 2-3 dependencies, pause and assess whether the code needs refactoring first. Common patterns to watch for:

| Smell | Symptom | Refactor |
|-------|---------|----------|
| God hook | Hook does fetching + state + side effects + UI logic | Split into data hook + logic hook + UI hook |
| Inline API calls | Function makes fetch calls directly | Extract to injectable service/action |
| Direct localStorage access | Component reads/writes storage directly | Extract to storage service |
| Chained async operations | Function orchestrates multiple async steps | Extract each step as pure function |

Tests should be simple. If they're not, the code needs work first.
