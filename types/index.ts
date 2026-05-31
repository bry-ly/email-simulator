export interface User {
	id: string;
	name: string;
	email: string;
	avatarColor: string;
}

export interface Message {
	id: string;
	from: string;
	to: string;
	subject: string;
	body: string;
	timestamp: string;
	read: boolean;
	folder: "inbox" | "outbox" | "drafts" | "trash";
	labels: string[];
}

export interface MessageLog {
	id: string;
	action: "sent" | "received" | "read" | "deleted" | "archived";
	messageId: string;
	userId: string;
	timestamp: string;
	details: string;
}
