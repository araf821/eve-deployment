import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  integer,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

export const usersTable = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  lat: real("lat"),
  lng: real("lng"),
  locationUpdated: timestamp("locationUpdated", { mode: "date" }),
});

export const accountsTable = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessionsTable = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokensTable = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  verificationToken => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

// Buddy requests table
export const buddyRequestsTable = pgTable("buddy_request", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  senderId: text("sender_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  receiverId: text("receiver_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  nickname: text("nickname").notNull(),
  phoneNumber: text("phone_number"),
  status: text("status").default("pending").notNull(), // pending, accepted, rejected
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Buddy connections table
export const buddyConnectionsTable = pgTable("buddy_connection", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  buddyId: text("buddy_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  nickname: text("nickname").notNull(),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  sentBuddyRequests: many(buddyRequestsTable, {
    relationName: "sentRequests",
  }),
  receivedBuddyRequests: many(buddyRequestsTable, {
    relationName: "receivedRequests",
  }),
  buddyConnections: many(buddyConnectionsTable, {
    relationName: "userBuddies",
  }),
  buddyOf: many(buddyConnectionsTable, {
    relationName: "buddyOfUser",
  }),
}));

export const buddyRequestsRelations = relations(
  buddyRequestsTable,
  ({ one }) => ({
    sender: one(usersTable, {
      fields: [buddyRequestsTable.senderId],
      references: [usersTable.id],
      relationName: "sentRequests",
    }),
    receiver: one(usersTable, {
      fields: [buddyRequestsTable.receiverId],
      references: [usersTable.id],
      relationName: "receivedRequests",
    }),
  })
);

export const buddyConnectionsRelations = relations(
  buddyConnectionsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [buddyConnectionsTable.userId],
      references: [usersTable.id],
      relationName: "userBuddies",
    }),
    buddy: one(usersTable, {
      fields: [buddyConnectionsTable.buddyId],
      references: [usersTable.id],
      relationName: "buddyOfUser",
    }),
  })
);
