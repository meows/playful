/* -----------------------------------------------------------------------------
 * This is an entry point for BetterAuth for local development.
 * - If ya'll using this with Fastify then you're looking to import `auth.ts`
 *   as this is only for internal testing.
 * -------------------------------------------------------------------------- */

import env from "~/env/internal"
import factory from "~/factory"
import auth from "~/lib/auth"
import { bold, check, error } from "~/lib/console"

// —————————————————————————————————————————————————————————————————————————————
// Main Route

const app = factory.createApp()
  .get("/", c => c.text("Hello."))
  .on(["POST", "GET"], "/api/auth/*", c => auth.handler(c.req.raw))

export type App = typeof app

// —————————————————————————————————————————————————————————————————————————————
// Serve

const server = Bun.serve({
  fetch: app.fetch,
  port: env.SERVER_PORT,
})

console.log(`${check} BetterAuth server on ${server.hostname}:${server.port}`)

// -----------------------------------------------------------------------------
// Cleanup

const TIMEOUT = 5000

function shutdown() {
  console.log(`${bold("→")} Shutting down BetterAuth server.`)
  const cleanup = server.stop()
  const timer = Bun.sleep(TIMEOUT).then(() => Promise.reject(Error("TIMEOUT")))
  Promise.race([cleanup, timer])
    .then(() => {
      console.log(`${check} Cleanup complete. Exiting.`)
      process.exit(0)
    })
    .catch((err) => {
      if (err instanceof Error && err.message === "TIMEOUT") 
        console.log(`${error} Cleanup timed out. Force exiting.`)
      else console.error(`${error} Cleanup failed:`, err)
      process.exit(1)
    })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
process.on("SIGQUIT", shutdown)
