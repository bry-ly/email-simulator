"use client";

import { useUser } from "@/contexts/user-context";
import { MessageList } from "@/components/email/message-list";

export default function OutboxPage() {
	const { currentUser } = useUser();

	if (!currentUser) return null;

	return (
		<MessageList
			email={currentUser.email}
			folder="outbox"
			title="Outbox"
		/>
	);
}
