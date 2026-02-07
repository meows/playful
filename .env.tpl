# ------------------------------------------------------------------------------
# Note: environment variables are documented at validation under ~/src/env/*.
# ------------------------------------------------------------------------------

# ——————————————————————————————————————————————————————————————————————————————
# Internal

# this is just for testing as I expect teammates will host this elsewhere
SERVER_HOSTNAME=localhost
SERVER_PORT=4321

DRIZZLE_DIR=./drizzle  # directory for the database file
DRIZZLE_DB=auth.sqlite # name of the database file

# manually generated secret
BETTER_AUTH_SECRET=op://betterauth/main/BETTER_AUTH_SECRET
BETTER_AUTH_URL=http://${SERVER_HOSTNAME}:${SERVER_PORT} # touchpoint for clients
BETTER_AUTH_ADMIN_EMAIL=admin@vovo.dev # used for authentication email flows

# manually generated from https://github.com/settings/applications/new
GITHUB_CLIENT_ID=op://betterauth/github/GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=op://betterauth/github/GITHUB_CLIENT_SECRET

# MailPace transactional email service
MAILPACE_KEY=op://betterauth/email/MAILPACE_KEY

# ——————————————————————————————————————————————————————————————————————————————
# Public

# base url of BetterAuth instance
VITE_AUTH_CLIENT_URL=http://${SERVER_HOSTNAME}:${SERVER_PORT}
