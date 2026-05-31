import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	avatarColor: text("avatar_color").notNull(),
});

export const messages = pgTable("messages", {
	id: text("id").primaryKey(),
	from: text("from").notNull(),
	to: text("to").notNull(),
	subject: text("subject").notNull(),
	body: text("body").notNull(),
	timestamp: timestamp("timestamp").notNull(),
	read: boolean("read").notNull().default(false),
	folder: text("folder", { enum: ["inbox", "outbox", "drafts", "trash"] }).notNull(),
	labels: text("labels").array().notNull().default([]),
});

export const messageLogs = pgTable("message_logs", {
	id: text("id").primaryKey(),
	action: text("action", { enum: ["sent", "received", "read", "deleted", "archived"] }).notNull(),
	messageId: text("message_id").notNull(),
	userId: text("user_id").notNull(),
	timestamp: timestamp("timestamp").notNull(),
	details: text("details").notNull(),
});
