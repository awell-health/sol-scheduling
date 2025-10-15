---
"@awell-health/sol-scheduling": patch
---

Migrate to monorepo architecture with Turbo and add standalone Next.js scheduling application

- Migrated from Yarn PnP to pnpm workspaces for better monorepo support
- Added Turbo for efficient build orchestration and caching
- Added standalone Next.js scheduling application with App Router
- Implemented modular React hooks architecture
- Added OAuth authentication flow for SOL API access
- Fixed date handling for availability slots
- Updated CI/CD workflows for monorepo structure