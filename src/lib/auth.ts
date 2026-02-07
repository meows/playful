/* -----------------------------------------------------------------------------
 * BetterAuth Hono middleware
 * - Basically where everything about BetterAuth is configured.
 * - https://www.better-auth.com/docs/reference/options
 * -------------------------------------------------------------------------- */

import { passkey } from "@better-auth/passkey"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { type BetterAuthOptions, betterAuth } from "better-auth/minimal"
import { jwt, oAuthProxy, openAPI } from "better-auth/plugins"
import { renderToStaticMarkup } from "react-dom/server"

import EmailResetPassword from "~/component/template-email-reset-password"
import EmailVerify from "~/component/template-email-verify"
import db from "~/db/client"
import * as schema from "~/db/schema"
import env from "~/env/internal"
import sendEmail from "~/lib/mailpace"

// —————————————————————————————————————————————————————————————————————————————
// Configuration Options

const MINUTE = 60
const DAY = 86_400
const WEEK = 604_800

// BetterAuth won't accept requests from unknown origins by default.
// https://www.better-auth.com/docs/reference/options#trustedorigins
const trustedOrigins: BetterAuthOptions["trustedOrigins"] = [
  "http://localhost:4321",
  "http://localhost:3000",
]

// https://www.better-auth.com/docs/reference/options#session
const session: BetterAuthOptions["session"] = {
  expiresIn: WEEK * 2,
  updateAge: DAY,
  freshAge: MINUTE * 5,
}

// https://www.better-auth.com/docs/reference/options#advanced
const advanced: BetterAuthOptions["advanced"] = {
  cookies: {
    sessionToken: {
      attributes: {
        secure: true,
        partitioned: true,
        sameSite: "lax", // @todo adjust to "none" in prod
      },
    },
  },
  crossSubDomainCookies: {
    enabled: true,
  },
}

// https://www.better-auth.com/docs/concepts/rate-limit
const rateLimit: BetterAuthOptions["rateLimit"] = {
  storage: "database",
}

// -----------------------------------------------------------------------------
// Email and Password

// https://www.better-auth.com/docs/reference/options#emailandpassword
const emailAndPassword: BetterAuthOptions["emailAndPassword"] = {
  enabled: true,
  requireEmailVerification: true,
  resetPasswordTokenExpiresIn: MINUTE * 30,
  revokeSessionsOnPasswordReset: true,
  async sendResetPassword({ user: { email }, url }) {
    await sendEmail(env.MAILPACE_KEY, {
      from: env.BETTER_AUTH_ADMIN_EMAIL,
      to: email,
      subject: "Reset Password",
      htmlbody: renderToStaticMarkup(EmailResetPassword({ url }))
    })
  },
}

// https://www.better-auth.com/docs/reference/options#emailverification
const emailVerification: BetterAuthOptions["emailVerification"] = {
  expiresIn: MINUTE * 30,
  sendOnSignUp: true,
  async sendVerificationEmail({ user: { email }, url }) {
    await sendEmail(env.MAILPACE_KEY, {
      from: env.BETTER_AUTH_ADMIN_EMAIL,
      to: email,
      subject: "Email Confirmation",
      htmlbody: renderToStaticMarkup(EmailVerify({ url }))
    })
  },
}

// -----------------------------------------------------------------------------
// Social Providers

// https://www.better-auth.com/docs/reference/options#socialproviders
const socialProviders: BetterAuthOptions["socialProviders"] = {
  github: {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  },
}

// —————————————————————————————————————————————————————————————————————————————
// BetterAuth

/**
 * BetterAuth Hono instance.
 * @see https://www.better-auth.com/docs/reference/options
 */
export const auth = betterAuth({
  advanced,
  appName: "BetterAuth Service",
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  emailAndPassword,
  emailVerification,
  experimental: { joins: true }, // https://www.better-auth.com/docs/concepts/database#experimental-joins
  logger: { level: "debug" },
  // Note that server plugins often need coordination with client plugins!
  plugins: [
    jwt(),        // https://www.better-auth.com/docs/plugins/jwt
    oAuthProxy(), // https://www.better-auth.com/docs/plugins/oauth-proxy
    openAPI(),    // https://www.better-auth.com/docs/plugins/open-api
    passkey(),    // https://www.better-auth.com/docs/plugins/passkey
  ],
  rateLimit,
  secret: env.BETTER_AUTH_SECRET,
  session,
  socialProviders,
  telemetry: { enabled: false },
  trustedOrigins,
})

// -----------------------------------------------------------------------------

/** BetterAuth session type. */
export type Session = typeof auth.$Infer.Session.session
/** BetterAuth user type. */
export type User = typeof auth.$Infer.Session.user

export default auth
