/** ----------------------------------------------------------------------------
 * For augmenting Hono instances with context.
 * @see https://hono.dev/docs/helpers/factory
 * -------------------------------------------------------------------------- */

import { betterAuth } from "better-auth"
import { type Hono } from "hono"
import { createFactory } from "hono/factory"

import auth from "~/lib/auth"

// —————————————————————————————————————————————————————————————————————————————
// Environment

/**
 * The context type for the Cloudflare hono instance.
 * - `CloudflareBindings` is manually generated from the `wrangler.jsonc` file.
 */
export type Env = {
  /** Types for `env` in Hono handler context. */
  // Bindings: CloudflareBindings
  /** Types for `vars` in Hono handler context. */
  Variables: {
    auth: ReturnType<typeof betterAuth>
  }
}

/**
 * If `WorkerEnv` and thus `c.env` has type issues then you need to generate the
 * types by running `bunx wrangler types` at the root of the subproject.
 */
function initApp(app: Hono<Env>) {
  app.use(async (c, next) => {
    c.set("auth", auth)
    await next()
  })
}

// —————————————————————————————————————————————————————————————————————————————
// Factory

/**
 * App factory for creating routes with context.
 * 
 * ```ts
 * const app = factory.createApp()
 *   .get("/", c => ({
 *     // `env` and `var` should now be typed
 *     env: c.env,
 *     var: c.var,
 *   }))
 * ```
 */
const factory = createFactory<Env>({ initApp })
export default factory
