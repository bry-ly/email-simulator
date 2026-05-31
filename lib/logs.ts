import { readJson, writeJson } from "./storage";
import type { MessageLog } from "@/types";

export function getLogs(): MessageLog[] {
	return readJson<MessageLog[]>("activity.json", "logs");
}

export function getLogsByUser(userId: string): MessageLog[] {
	return getLogs()
		.filter((l) => l.userId === userId)
		.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		);
}

export function addLog(
	log: Omit<MessageLog, "id" | "timestamp">
): MessageLog {
	const logs = getLogs();
	const newLog: MessageLog = {
		...log,
		id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
		timestamp: new Date().toISOString(),
	};
	logs.push(newLog);
	writeJson("activity.json", logs, "logs");
	return newLog;
}
