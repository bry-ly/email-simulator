import { db } from "./db";
import { messages } from "./db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { Message } from "@/types";

function toMessage(row: typeof messages.$inferSelect): Message {
	return {
		...row,
		timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : String(row.timestamp),
		labels: row.labels ?? [],
	};
}

export async function getMessagesByEmail(email: string): Promise<Message[]> {
	const rows = await db.select().from(messages).where(
		sql`${messages.from} = ${email} OR ${messages.to} = ${email}`
	);
	return rows.map(toMessage);
}

export async function getMessagesByFolder(
	email: string,
	folder: Message["folder"]
): Promise<Message[]> {
	const rows = await db.select().from(messages).where(
		and(
			sql`${messages.from} = ${email} OR ${messages.to} = ${email}`,
			eq(messages.folder, folder)
		)
	);
	return rows
		.map(toMessage)
		.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		);
}

export async function getMessageById(
	email: string,
	messageId: string
): Promise<Message | undefined> {
	const result = await db.select().from(messages).where(
		and(
			eq(messages.id, messageId),
			sql`${messages.from} = ${email} OR ${messages.to} = ${email}`
		)
	);
	if (result.length === 0) return undefined;
	return toMessage(result[0]);
}

export async function saveMessage(email: string, message: Message): Promise<void> {
	const existing = await db.select().from(messages).where(eq(messages.id, message.id));
	const dbMessage = {
		...message,
		timestamp: new Date(message.timestamp),
		labels: message.labels ?? [],
	};
	if (existing.length > 0) {
		await db.update(messages).set(dbMessage).where(eq(messages.id, message.id));
	} else {
		await db.insert(messages).values(dbMessage);
	}
}

export async function updateMessage(
	email: string,
	messageId: string,
	updates: Partial<Message>
): Promise<Message | null> {
	const dbUpdates: Record<string, unknown> = { ...updates };
	if (updates.timestamp !== undefined) {
		dbUpdates.timestamp = new Date(updates.timestamp);
	}
	const result = await db.update(messages)
		.set(dbUpdates)
		.where(eq(messages.id, messageId))
		.returning();
	if (result.length === 0) return null;
	return toMessage(result[0]);
}

export async function deleteMessage(messageId: string): Promise<void> {
	await db.delete(messages).where(eq(messages.id, messageId));
}

export async function getUnreadCount(email: string): Promise<number> {
	const result = await db.select({ count: messages.id }).from(messages).where(
		and(
			eq(messages.to, email),
			eq(messages.folder, "inbox"),
			eq(messages.read, false)
		)
	);
	return result.length;
}

export async function getFolderCounts(email: string) {
	const all = await db.select().from(messages).where(
		sql`${messages.from} = ${email} OR ${messages.to} = ${email}`
	);
	return {
		inbox: all.filter((m) => m.folder === "inbox").length,
		unread: all.filter((m) => m.folder === "inbox" && !m.read).length,
		outbox: all.filter((m) => m.folder === "outbox").length,
		drafts: all.filter((m) => m.folder === "drafts").length,
		trash: all.filter((m) => m.folder === "trash").length,
	};
}
