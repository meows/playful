/* -----------------------------------------------------------------------------
 * Everything here be available strictly at developer or build time, but expect
 * that these may be included in the public client.
 * - Documentation of environment variables should be concentrated here for
 *   propogation to downstream users.
 * -------------------------------------------------------------------------- */

import { minLength, object, parse, pipe, string } from "valibot"

// —————————————————————————————————————————————————————————————————————————————
// Validation

/**
 * Environment variables shared between client and infra.
 * - expect these to be potentially statically included in the client
 * - anything on the client must be prefixed with `VITE_`
 */
const schema_shared = object({
  VITE_AUTH_CLIENT_URL: pipe(string(), minLength(1)),
})

// —————————————————————————————————————————————————————————————————————————————
// Source

/** Shared environment variables. */
export const shared = parse(schema_shared, import.meta.env)
export default shared
