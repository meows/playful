# About your BetterAuth instance
- I assume that auth will never be too stressful (under 100,000 MAU) and that
  disk is not very expensive.
- BetterAuth is a Hono instance with a flexible (and optional for stateless)
  storage layer, in this case I choose sqlite but one can switch around with a
  relatively straightforward translation.
- This example coincidentally uses the MailPace transactional email service.
- Almost everything about this BetterAuth instance can be configured on `/src/lib/auth.ts`.

# Project Directory Overview
- project root
  - `drizzle/` business files for Drizzle
  - `drizzle.config.ts` for drizzle-kit operations
- `src/` folder
  - `client/` are clients for vanilla TypeScript, React, etc.
  - `component` are TSX components, such as for email templates
  - `context/` are resources meant to shared via Hono context
  - `db/` drizzle schema & db client
  - `env/` internal and shared env files
  - `lib/` I put the BetterAuth instance here because the docs said so but...

> [!NOTE]
> Modifications to plugins on the serverside for `src/lib/auth.ts` requires
> coordination with the clients under `src/client/*`.

# Installation
Make sure you have these dependencies:
- `bun` runtime
- 1Password and their `op` CLI tool

## One-time initial setup

> [!IMPORTANT]
> This section requires that you've filled out the values in `.env` following
> the example from `.env.example` or `.env.tpl`.

Push the schema to local or remote (!) depending on configuration, creating the
sqlite file as long as the folder exists.

```bash
bunx drizzle-kit push
```
