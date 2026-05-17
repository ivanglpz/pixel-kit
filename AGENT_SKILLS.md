# PixelKit Agent Skills

These skills are installed locally under `.agents/skills`, but `.agents/` is intentionally ignored by Git. Use `skills-lock.json` as the reproducible record of what should be installed.

## Installed Skills

- `vercel-react-best-practices`: React and Next.js performance rules from Vercel Engineering.
- `react-components`: Stitch-to-React component workflow for modular Vite/React components.
- `react-best-practices`: Vercel plugin React best-practices guidance.
- `monorepo-management`: pnpm/Turborepo/Nx monorepo structure and dependency management.
- `next-best-practices`: Next.js file conventions, RSC boundaries, async/data patterns, metadata, and runtime guidance.
- `shadcn-ui`: shadcn/ui component usage, customization, and integration guidance.
- `typescript-advanced-types`: advanced TypeScript type modeling and reusable type utility patterns.
- `turborepo`: Turborepo task pipeline, caching, and workspace guidance.

## When To Use Them In PixelKit

- Monorepo migration: `monorepo-management`, `turborepo`, `typescript-advanced-types`.
- Current web app and future `apps/web`: `next-best-practices`, `vercel-react-best-practices`.
- Shared editor and desktop renderer UI: `vercel-react-best-practices`, `react-best-practices`, `react-components`.
- UI system and shadcn components: `shadcn-ui`.

## Notes

- Do not commit `.agents/`; it contains installed skill contents.
- Commit `skills-lock.json`; it records installed skill sources and hashes.
- Skills run with agent permissions, so review new or updated skills before use.
- If a skill is updated upstream, reinstall it intentionally and review the lockfile diff.
