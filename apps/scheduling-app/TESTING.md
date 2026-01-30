# Testing Infrastructure

This document describes the testing infrastructure for the scheduling-app.

## Overview

The testing suite consists of three layers:

1. **Unit/Integration Tests** - Vitest with React Testing Library (237 tests)
2. **UI Component Tests** - Storybook with interaction tests (165 tests)
3. **End-to-End Tests** - Playwright with custom fixtures (to be written)

## Quick Start

```bash
# Unit tests
pnpm test              # Run all tests once
pnpm test:watch        # Watch mode for development
pnpm test:coverage     # Generate coverage report

# Storybook
pnpm storybook         # Start dev server on http://localhost:6006
pnpm test:storybook    # Run Storybook interaction tests
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
│   ├── preview.ts           # Global decorators, parameters, MSW init
│   └── mocks/               # Storybook-specific module stubs
├── mocks/                   # MSW mock infrastructure
│   ├── browser.ts           # Browser worker for Storybook
│   ├── fixtures.ts          # Mock data (providers, availability, etc.)
│   ├── handlers.ts          # API route handlers
│   └── server.ts            # Node.js server for Vitest
├── __checks__/fixtures/     # Playwright test fixtures
│   ├── api.fixture.ts       # Network-level API mocking
│   ├── localStorage.fixture.ts
│   └── salesforce.fixture.ts
├── components/ui/*.stories.tsx    # UI component stories
├── app/**/*.stories.tsx           # Feature component stories
├── lib/**/__tests__/              # Unit tests
├── app/**/__tests__/              # Server action tests
└── tests/                         # Playwright E2E tests
```

## Unit Tests (Vitest)

- **Environment**: jsdom with MSW for API mocking
- **Path aliases**: `@/` maps to project root
- **Coverage**: Workflow steps, server actions, hooks, utilities

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Using MSW

```typescript
import { server } from '@/mocks/server';
import { createErrorHandler } from '@/mocks/handlers';

it('handles API errors', async () => {
  server.use(createErrorHandler('/api/v2/provider', 500, 'Server Error'));
  // ... test error handling
});
```

## Storybook

- **Framework**: `@storybook/nextjs-vite`
- **Addons**: essentials, interactions, a11y
- **MSW**: Initialized in preview for API mocking

### Writing Stories

```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, userEvent, expect } from 'storybook/test';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: 'Click me' }
};

export const WithInteraction: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    await expect(args.onClick).toHaveBeenCalled();
  }
};
```

## Playwright E2E Tests

- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit + Mobile
- **Fixtures**: API mocking, localStorage helpers, Salesforce client

### Test Fixtures

```typescript
import { test, expect } from '../__checks__/fixtures';

test('completes booking flow', async ({ page, localStorage, apiMock }) => {
  await apiMock.setupMocks();
  await page.goto('/');
  await localStorage.setOnboardingData({ state: 'CO', service: 'Therapy' });
  await page.goto('/providers');
  await expect(page.getByText('Sarah Johnson')).toBeVisible();
});
```

## Remaining Work

### E2E Tests

- [ ] `tests/onboarding.spec.ts` - Complete onboarding flow
- [ ] `tests/provider-selection.spec.ts` - Filtering and selection
- [ ] `tests/booking.spec.ts` - Booking workflow (mocked)
- [ ] `tests/confirmation.spec.ts` - Confirmation page

### Accessibility (A11y) Fixes

The Storybook test runner includes axe-core accessibility testing. Currently set to `'todo'` mode (warnings only). To enforce strict compliance, change in `.storybook/preview.ts`:

```typescript
a11y: {
  test: 'error'; // Fail tests on violations
}
```

#### Known Issues Summary

| Violation Type | Count | WCAG Level | Fix                                                |
| -------------- | ----- | ---------- | -------------------------------------------------- |
| Color Contrast | ~90   | AA         | Adjust slate color usage for small text            |
| Button Name    | ~15   | A          | Add `aria-label` to icon buttons and empty selects |
| Form Labels    | ~5    | A          | Add labels to form inputs in stories               |

#### Color Contrast Fixes Needed

| Issue                                          | Fix                                |
| ---------------------------------------------- | ---------------------------------- |
| `text-slate-500` on light backgrounds (4.22:1) | Use `text-slate-600` for 12px text |
| `text-slate-400` placeholders (2.85:1)         | Use `text-slate-500` minimum       |
| `text-primary` on `bg-slate-50` (4.14:1)       | Use on white backgrounds only      |

#### Resources

- [axe-core Rules](https://dequeuniversity.com/rules/axe/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Guiding Principle

**If a unit requires extensive mocking, it's a code smell.**

When writing tests, if you need to mock more than 2-3 dependencies, the code likely needs refactoring first:

| Smell               | Symptom                                   | Refactor                       |
| ------------------- | ----------------------------------------- | ------------------------------ |
| God hook            | Hook does fetching + state + side effects | Split into data/logic/UI hooks |
| Inline API calls    | Function makes fetch calls directly       | Extract to injectable service  |
| Direct localStorage | Component reads/writes storage            | Extract to storage service     |

Tests should be simple. If they're not, the code needs work first.
