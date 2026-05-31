import { db } from "./db";
import { messageLogs } from "./db/schema";
import { eq } from "drizzle-orm";
import type { MessageLog } from "@/types";

function toLog(row: typeof messageLogs.$inferSelect): MessageLog {
	return {
		...row,
		timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : String(row.timestamp),
	};
}

export async function getLogs(): Promise<MessageLog[]> {
	const rows = await db.select().from(messageLogs);
	return rows.map(toLog);
}

export async function getLogsByUser(userId: string): Promise<MessageLog[]> {
	const rows = await db.select().from(messageLogs).where(
		eq(messageLogs.userId, userId)
	);
	return rows
		.map(toLog)
		.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		);
}

export async function addLog(
	log: Omit<MessageLog, "id" | "timestamp">
): Promise<MessageLog> {
	const newLog: MessageLog = {
		...log,
		id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
		timestamp: new Date().toISOString(),
	};
	await db.insert(messageLogs).values({
		...newLog,
		timestamp: new Date(newLog.timestamp),
	});
	return newLog;
}
