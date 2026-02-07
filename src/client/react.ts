import { passkeyClient } from "@better-auth/passkey/client"
import { createAuthClient } from "better-auth/react"
import shared from "~/env/shared"

// —————————————————————————————————————————————————————————————————————————————
// Client

/** React BetterAuth client. */
export const react = createAuthClient({
  baseURL: shared.VITE_AUTH_CLIENT_URL,
  plugins: [
    passkeyClient(), // https://www.better-auth.com/docs/plugins/passkey
  ],
})

export default react
