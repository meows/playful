/* -----------------------------------------------------------------------------
 * Drizzle client for backup service sqlite database
 * - Mind the WAL journal mode if you're going to use your own client!!! If you
 *   don't pay attention then there could be unexpected contention, leading to
 *   an exception.
 * -------------------------------------------------------------------------- */

import { Database } from "bun:sqlite"
import { drizzle } from "drizzle-orm/bun-sqlite"
import * as schema from "~/db/schema"
import env from "~/env/internal"

// —————————————————————————————————————————————————————————————————————————————
// Environment

const sqlite = new Database(`${env.DRIZZLE_DIR}/${env.DRIZZLE_DB}`, {
  create: true,
  strict: true,
  readwrite: true,
})

sqlite.run(`PRAGMA journal_mode = WAL;`)

// -----------------------------------------------------------------------------
// Drizzle Client

/** Drizzle sqlite client. */
export const client = drizzle({ client: sqlite, schema })

export default client
export type DB = typeof client