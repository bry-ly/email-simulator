"use server";

import type { Message } from "@/types";
import {
	getMessagesByEmail,
	getMessagesByFolder,
	getMessageById,
	saveMessage,
	updateMessage,
	getUnreadCount,
	getFolderCounts,
} from "@/lib/messages";
import { addLog } from "@/lib/logs";

export async function getMessagesAction(
	email: string,
	folder: Message["folder"]
) {
	return getMessagesByFolder(email, folder);
}

export async function getMessageAction(email: string, messageId: string) {
	return getMessageById(email, messageId);
}

export async function sendMessageAction(
	fromEmail: string,
	toEmail: string,
	subject: string,
	body: string
) {
	const now = new Date().toISOString();
	const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

	const outboxMessage: Message = {
		id,
		from: fromEmail,
		to: toEmail,
		subject,
		body,
		timestamp: now,
		read: true,
		folder: "outbox",
		labels: [],
	};

	const inboxMessage: Message = {
		...outboxMessage,
		read: false,
		folder: "inbox",
	};

	saveMessage(fromEmail, outboxMessage);
	saveMessage(toEmail, inboxMessage);

	addLog({
		action: "sent",
		messageId: id,
		userId: fromEmail,
		details: `Sent to ${toEmail}: ${subject}`,
	});

	addLog({
		action: "received",
		messageId: id,
		userId: toEmail,
		details: `Received from ${fromEmail}: ${subject}`,
	});

	return outboxMessage;
}

export async function markAsReadAction(email: string, messageId: string) {
	const msg = updateMessage(email, messageId, { read: true });
	if (msg) {
		addLog({
			action: "read",
			messageId,
			userId: email,
			details: `Read: ${msg.subject}`,
		});
	}
	return msg;
}

export async function moveToTrashAction(email: string, messageId: string) {
	const msg = updateMessage(email, messageId, { folder: "trash" });
	if (msg) {
		addLog({
			action: "deleted",
			messageId,
			userId: email,
			details: `Trashed: ${msg.subject}`,
		});
	}
	return msg;
}

export async function restoreFromTrashAction(
	email: string,
	messageId: string
) {
	return updateMessage(email, messageId, { folder: "inbox" });
}

export async function permanentDeleteAction(
	email: string,
	messageId: string
) {
	const messages = getMessagesByEmail(email);
	const filtered = messages.filter((m) => m.id !== messageId);
	const { writeJson } = await import("@/lib/storage");
	writeJson(`${email}.json`, filtered, "messages");
	return { success: true };
}

export async function saveDraftAction(
	email: string,
	subject: string,
	body: string,
	toEmail?: string
) {
	const id = `draft-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
	const draft: Message = {
		id,
		from: email,
		to: toEmail || "",
		subject,
		body,
		timestamp: new Date().toISOString(),
		read: true,
		folder: "drafts",
		labels: [],
	};
	saveMessage(email, draft);
	return draft;
}

export async function getUnreadCountAction(email: string) {
	return getUnreadCount(email);
}

export async function getFolderCountsAction(email: string) {
	return getFolderCounts(email);
}
