# SOL Scheduling Monorepo

Scheduling system with npm package (`@awell-health/sol-scheduling`) and standalone Next.js application.

## Installation & Development

```bash
# Install package
npm install @awell-health/sol-scheduling        # stable
npm install @awell-health/sol-scheduling@beta   # beta

# Development
git clone https://github.com/awell-health/sol-scheduling.git
pnpm install
pnpm dev              # all packages
pnpm dev:app          # just Next.js app
```

## Environment Variables

Copy `apps/scheduling-app/.env.example` to `apps/scheduling-app/.env.local` and configure SOL API credentials.

## Deployment

- **App**: [sol-scheduling.vercel.app](https://sol-scheduling.vercel.app) (auto-deploy on main)
- **Package**: [npm](https://www.npmjs.com/package/@awell-health/sol-scheduling) (auto-publish on main)

## Changesets & Releases

```bash
# Add changeset for package changes
pnpm changeset

# Beta releases - add [beta] to commit message
git commit -m "feat: new feature [beta]"

# Manual beta control
pnpm changeset pre enter beta    # enter beta mode
pnpm changeset pre exit          # exit beta mode (or use GitHub workflow)
```

**Release Process**: Push to `main` → auto version/publish. Beta commits create beta releases, normal commits create stable releases.

## GitHub Workflows

- **Auto**: Build/test on PRs, publish on main merge
- **Manual**: "Exit Beta Mode" workflow to exit beta releases

---

**Links**: [Live App](https://sol-scheduling.vercel.app) • [npm Package](https://www.npmjs.com/package/@awell-health/sol-scheduling)