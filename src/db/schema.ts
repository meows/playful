/** ----------------------------------------------------------------------------
 * BetterAuth service database schema
 * @see https://www.better-auth.com/docs/concepts/database#core-schema
 * @see https://www.better-auth.com/docs/guides/optimizing-for-performance
 * -------------------------------------------------------------------------- */

import { relations } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

// —————————————————————————————————————————————————————————————————————————————
// Environment

const chain = {
  delete: { onDelete: "cascade" } as const,
  null:   { onDelete: "set null" } as const,
}

const time = () => integer({ mode: "timestamp" })
const boolean = () => integer({ mode: "boolean" })
const json = () => text({ mode: "json" })

// —————————————————————————————————————————————————————————————————————————————
// Core Schema

/**
 * @see https://www.better-auth.com/docs/concepts/database#user
 */
export const user = sqliteTable("user", {
  id:            text().primaryKey(),
  name:          text().notNull(), // user display name
  email:         text().unique().notNull(),
  emailVerified: boolean().notNull().default(false),
  image:         text(),
  createdAt:     time().notNull().$defaultFn(() => new Date()),
  updatedAt:     time().notNull().$defaultFn(() => new Date()),
}, t => [
  index("idx_user_email").on(t.email),
])

/**
 * @see https://www.better-auth.com/docs/concepts/database#account
 */
export const account = sqliteTable("account", {
  id:                    text().primaryKey(),
  userId:                text().notNull().references(() => user.id, chain.delete),
  accountId:             text().notNull(),
  providerId:            text().notNull(),
  accessToken:           text(),
  refreshToken:          text(),
  accessTokenExpiresAt:  time(),
  refreshTokenExpiresAt: time(),
  scope:                 text(), // scope of account given by provider
  idToken:               text(),
  password:              text(),
  createdAt:             time().notNull().$defaultFn(() => new Date()),
  updatedAt:             time().notNull().$defaultFn(() => new Date()),
}, t => [
  index("idx_account_user_id").on(t.userId),
])

/**
 * @see https://www.better-auth.com/docs/concepts/database#session
 */
export const session = sqliteTable("session", {
  id:        text().primaryKey(),
  userId:    text().notNull().references(() => user.id, chain.delete),
  token:     text().unique().notNull(), // not required unique in the docs but...
  expiresAt: time().notNull(),
  ipAddress: text(),
  userAgent: text(),
  createdAt: time().notNull().$defaultFn(() => new Date()),
  updatedAt: time().notNull().$defaultFn(() => new Date()),
}, t => [
  index("idx_session_user_id").on(t.userId),
  index("idx_session_token").on(t.token),
])

/**
 * @see https://www.better-auth.com/docs/concepts/database#verification
 */
export const verification = sqliteTable("verification", {
  id:         text().primaryKey(),
  identifier: text().notNull(),
  value:      text().notNull(),
  expiresAt:  time().notNull(),
  createdAt:  time().notNull().$defaultFn(() => new Date()),
  updatedAt:  time().notNull().$defaultFn(() => new Date()),
}, t => [
  index("idx_verification_identifier").on(t.identifier),
])

// —————————————————————————————————————————————————————————————————————————————
// Plugin Schema

/**
 * Table for the `passkey` plugin.
 * @see https://www.better-auth.com/docs/plugins/passkey#schema
 */
export const passkey = sqliteTable("passkey", {
  id:            text().primaryKey(),
  name:          text(),
  publicKey:     text().notNull(),
  userId:        text().notNull().references(() => user.id, chain.delete),
  credentialID:  text().notNull(),
  counter:       integer().notNull(),
  deviceType:    text().notNull(),
  backedUp:      boolean().notNull(),
  transports:    text(),
  createdAt:     time().notNull().$defaultFn(() => new Date()),
  aaguid:        text(),
}, t => [
  index("idx_passkey_user_id").on(t.userId),
])

/**
 * Table for the `twoFactor` plugin.
 * @see https://www.better-auth.com/docs/plugins/2fa#schema
 */
export const twoFactor = sqliteTable("twoFactor", {
  id:           text().primaryKey(),
  userId:       text().notNull().references(() => user.id, chain.delete),
  secret:       text(),
  backupCodes:  text(),
}, t => [
  index("idx_twoFactor_secret").on(t.secret),
])

/**
 * Table for the `jwks` plugin.
 * @see https://www.better-auth.com/docs/plugins/jwt#schema
 */
export const jwks = sqliteTable("jwks", {
  id:          text().primaryKey(),
  publicKey:   text().notNull(),
  privateKey:  text().notNull(),
  createdAt:   time().notNull().$defaultFn(() => new Date()),
  expiresAt:   time(),
})

// —————————————————————————————————————————————————————————————————————————————
// Relations
// • https://www.better-auth.com/docs/adapters/drizzle#joins-experimental

export const userRelations = relations(user, ({ one, many }) => ({
  accounts:  many(account),
  sessions:  many(session),
  passkeys:  many(passkey),
  twoFactor: one(twoFactor),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const passkeyRelations = relations(passkey, ({ one }) => ({
  user: one(user, {
    fields: [passkey.userId],
    references: [user.id],
  }),
}))

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
  user: one(user, {
    fields: [twoFactor.userId],
    references: [user.id],
  }),
}))
