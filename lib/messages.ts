import { readJson, writeJson } from "./storage";
import type { Message } from "@/types";

function getUserMessagesFile(email: string): string {
	return `${email}.json`;
}

export function getMessagesByEmail(email: string): Message[] {
	return readJson<Message[]>(getUserMessagesFile(email), "messages");
}

export function getMessagesByFolder(
	email: string,
	folder: Message["folder"]
): Message[] {
	return getMessagesByEmail(email)
		.filter((m) => m.folder === folder)
		.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		);
}

export function getMessageById(
	email: string,
	messageId: string
): Message | undefined {
	return getMessagesByEmail(email).find((m) => m.id === messageId);
}

export function saveMessage(email: string, message: Message): void {
	const messages = getMessagesByEmail(email);
	const existing = messages.findIndex((m) => m.id === message.id);
	if (existing >= 0) {
		messages[existing] = message;
	} else {
		messages.push(message);
	}
	writeJson(getUserMessagesFile(email), messages, "messages");
}

export function updateMessage(
	email: string,
	messageId: string,
	updates: Partial<Message>
): Message | null {
	const messages = getMessagesByEmail(email);
	const idx = messages.findIndex((m) => m.id === messageId);
	if (idx < 0) return null;
	messages[idx] = { ...messages[idx], ...updates };
	writeJson(getUserMessagesFile(email), messages, "messages");
	return messages[idx];
}

export function getUnreadCount(email: string): number {
	return getMessagesByEmail(email).filter(
		(m) => m.folder === "inbox" && !m.read
	).length;
}

export function getFolderCounts(email: string) {
	const messages = getMessagesByEmail(email);
	return {
		inbox: messages.filter((m) => m.folder === "inbox").length,
		unread: messages.filter((m) => m.folder === "inbox" && !m.read).length,
		outbox: messages.filter((m) => m.folder === "outbox").length,
		drafts: messages.filter((m) => m.folder === "drafts").length,
		trash: messages.filter((m) => m.folder === "trash").length,
	};
}
