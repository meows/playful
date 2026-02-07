import { passkeyClient } from "@better-auth/passkey/client"
import { createAuthClient } from "better-auth/client"
import shared from "~/env/shared"

// —————————————————————————————————————————————————————————————————————————————
// Client

/** Vanilla BetterAuth client. */
export const vanilla = createAuthClient({
  baseURL: shared.VITE_AUTH_CLIENT_URL,
  plugins: [
    passkeyClient(), // https://www.better-auth.com/docs/plugins/passkey
  ],
})

export default vanilla
