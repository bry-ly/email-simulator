import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	avatarColor: text("avatar_color").notNull().default("#6366f1"),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

// App tables

export const messages = pgTable(
	"messages",
	{
		id: text("id").primaryKey(),
		from: text("from").notNull(),
		to: text("to").notNull(),
		subject: text("subject").notNull(),
		body: text("body").notNull(),
		timestamp: timestamp("timestamp").notNull(),
		read: boolean("read").notNull().default(false),
		folder: text("folder", { enum: ["inbox", "outbox", "drafts", "trash"] }).notNull(),
		labels: text("labels").array().notNull().default([]),
	},
	(table) => [
		index("messages_from_idx").on(table.from),
		index("messages_to_idx").on(table.to),
		index("messages_folder_idx").on(table.folder),
		index("messages_owner_folder_idx").on(table.from, table.to, table.folder),
	],
);

export const messageLogs = pgTable(
	"message_logs",
	{
		id: text("id").primaryKey(),
		action: text("action", { enum: ["sent", "received", "read", "deleted", "archived"] }).notNull(),
		messageId: text("message_id").notNull(),
		userId: text("user_id").notNull(),
		timestamp: timestamp("timestamp").notNull(),
		details: text("details").notNull(),
	},
	(table) => [
		index("message_logs_user_idx").on(table.userId),
		index("message_logs_message_idx").on(table.messageId),
		index("message_logs_timestamp_idx").on(table.timestamp),
	],
);
