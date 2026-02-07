/* -----------------------------------------------------------------------------
 * Currently this is exclusively for drizzle-kit operations.
 * -------------------------------------------------------------------------- */

import { defineConfig } from "drizzle-kit"
import env from "~/env/internal"

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./raw/drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: `${env.DRIZZLE_DIR}/${env.DRIZZLE_DB}`,
  },
})
