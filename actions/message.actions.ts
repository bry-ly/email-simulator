"use server";

import type { Message } from "@/types";
import {
	getMessagesByFolder,
	getMessageById,
	saveMessage,
	updateMessage,
	deleteMessage,
	getUnreadCount,
	getFolderCounts,
} from "@/lib/messages";
import { addLog } from "@/lib/logs";
import { revalidatePath } from "next/cache";

export async function getMessagesAction(
	email: string,
	folder: Message["folder"]
) {
	return await getMessagesByFolder(email, folder);
}

export async function getMessageAction(email: string, messageId: string) {
	return await getMessageById(email, messageId);
}

export async function sendMessageAction(
	fromEmail: string,
	toEmail: string,
	subject: string,
	body: string
) {
	const now = new Date().toISOString();

	const outboxMessage: Message = {
		id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
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
		id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
		from: fromEmail,
		to: toEmail,
		subject,
		body,
		timestamp: now,
		read: false,
		folder: "inbox",
		labels: [],
	};

	await saveMessage(fromEmail, outboxMessage);
	await saveMessage(toEmail, inboxMessage);

	await addLog({
		action: "sent",
		messageId: outboxMessage.id,
		userId: fromEmail,
		details: `Sent to ${toEmail}: ${subject}`,
	});

	await addLog({
		action: "received",
		messageId: inboxMessage.id,
		userId: toEmail,
		details: `Received from ${fromEmail}: ${subject}`,
	});

	revalidatePath("/dashboard");

	return outboxMessage;
}

export async function markAsReadAction(email: string, messageId: string) {
	const msg = await updateMessage(email, messageId, { read: true });
	if (msg) {
		await addLog({
			action: "read",
			messageId,
			userId: email,
			details: `Read: ${msg.subject}`,
		});
	}
	revalidatePath("/dashboard");
	return msg;
}

export async function moveToTrashAction(email: string, messageId: string) {
	const msg = await updateMessage(email, messageId, { folder: "trash" });
	if (msg) {
		await addLog({
			action: "deleted",
			messageId,
			userId: email,
			details: `Trashed: ${msg.subject}`,
		});
	}
	revalidatePath("/dashboard");
	return msg;
}

export async function restoreFromTrashAction(
	email: string,
	messageId: string
) {
	const msg = await updateMessage(email, messageId, { folder: "inbox" });
	revalidatePath("/dashboard");
	return msg;
}

export async function permanentDeleteAction(
	email: string,
	messageId: string
) {
	await deleteMessage(messageId);
	revalidatePath("/dashboard");
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
	await saveMessage(email, draft);
	revalidatePath("/dashboard");
	return draft;
}

export async function getUnreadCountAction(email: string) {
	return getUnreadCount(email);
}

export async function getFolderCountsAction(email: string) {
	return getFolderCounts(email);
}
