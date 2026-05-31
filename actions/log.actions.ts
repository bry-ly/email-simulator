"use server";

import { getLogs, getLogsByUser } from "@/lib/logs";

export async function getLogsAction(userId?: string) {
	if (userId) {
		return getLogsByUser(userId);
	}
	const logs = await getLogs();
	return logs.sort(
		(a, b) =>
			new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
	);
}
