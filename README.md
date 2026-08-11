# Trade Orbit CRM

Premium telecalling & lead management CRM frontend prototype for Trade Orbit (trading education, India).

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- shadcn-style Radix UI primitives
- Lucide icons
- Recharts
- date-fns

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/overview`.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript (`tsc --noEmit`)

## Architecture

```
src/
  app/(crm)/          # CRM routes + shell layout
  components/         # UI primitives + layout + shared
  features/           # Page-level feature modules
  types/              # Domain TypeScript types
  lib/                # utils, labels, selectors
  mock-data/          # Centralized typed mock dataset
```

Mock data is intentionally centralized so Supabase (or another API) can replace it in the next phase without rewriting screens.

## Pages

- Overview dashboard
- My Calling workspace
- Leads table + Lead 360 detail
- Follow-ups workspace
- Nurturing pipeline (board + list)
- Team performance
- Reports
- Settings
