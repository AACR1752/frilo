# Architecture

## Overview

Love Tracker is a TanStack Start (React + SSR) application deployed on Netlify. It uses Netlify Database (Postgres) for persistence via Drizzle ORM.

## Key Directories

```
src/routes/          # TanStack Start file-based routes
  index.tsx          # Main SPA: Login + Dashboard UI
  api/
    auth.ts          # POST /api/auth — keyword auth, returns user type
    data.$user.ts    # GET/PUT /api/data/:user — read/write gift & date
    love.$user.ts    # POST /api/love/:user — increment love counter

db/
  schema.ts          # Drizzle schema — nirdan_data & hribil_data tables
  index.ts           # Drizzle client singleton

netlify/database/migrations/   # Auto-applied SQL migrations
drizzle.config.ts              # Points drizzle-kit output here
```

## Auth Design

Authentication is keyword-based (no JWT/session). The keyword `Nirdan` maps to the `nirdan_data` table; `Hribil` maps to `hribil_data`. State is kept in React (`useState`) — refreshing the page shows the login screen again (stateless by design).

## Database

Two isolated tables (`nirdan_data`, `hribil_data`) share the same schema: `gift_idea`, `important_date`, `love_count`, `updated_at`. Each table always has exactly one row (upsert-on-first-access pattern).

## Coding Conventions

- TypeScript throughout; `.js` extensions in imports for ESM compatibility
- API routes return `Response.json(...)` directly (Web Fetch API)
- No ORM relations needed — single-row tables queried with `limit(1)`
- Tailwind CSS utility classes only; no CSS modules
