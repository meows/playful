/* -----------------------------------------------------------------------------
 * Everything here be available strictly at developer or build time.
 * - Documentation of environment variables should be concentrated here for
 *   propogation to downstream users.
 * -------------------------------------------------------------------------- */

import { integer, minLength, minValue, object, parse, pipe, string, toNumber } from "valibot"

// —————————————————————————————————————————————————————————————————————————————
// Validation

/**
 * Environment variables specific to the infra.
 * - These should have access to `process.env` to be parsed.
 */
const schema_internal = object({
  /** Hostname of the server. */
  SERVER_HOSTNAME: pipe(string(), minLength(1)),
  /** Port of the server. */
  SERVER_PORT: pipe(string(), toNumber(), integer(), minValue(1)),

  /** Local directory for the Drizzle metadata and migrations. */
  DRIZZLE_DIR: pipe(string(), minLength(1)),
  /** Name of the Drizzle sqlite database file. */
  DRIZZLE_DB: pipe(string(), minLength(1)),

  /** Manually generated secret on per-instance basis. @see https://www.better-auth.com/docs/installation#set-environment-variables */
  BETTER_AUTH_SECRET: pipe(string(), minLength(1)),
  /** Base URL of the BetterAuth instance. */
  BETTER_AUTH_URL: pipe(string(), minLength(1)),
  /** Admin email for BetterAuth email flows. */
  BETTER_AUTH_ADMIN_EMAIL: pipe(string(), minLength(1)),

  /** Manually generated GitHub OAuth client ID. @see https://github.com/settings/applications/new */
  GITHUB_CLIENT_ID: pipe(string(), minLength(1)),
  /** Manually generated GitHub OAuth client secret. @see https://github.com/settings/applications/new */
  GITHUB_CLIENT_SECRET: pipe(string(), minLength(1)),

  /** MailPace API key for transactional email service. */
  MAILPACE_KEY: pipe(string(), minLength(1)),
})

// —————————————————————————————————————————————————————————————————————————————
// Source

/** Internal environment variables. */
export const internal = parse(schema_internal, process.env)
export default internal
