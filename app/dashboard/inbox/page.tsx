"use client";

import { useUser } from "@/contexts/user-context";
import { MessageList } from "@/components/email/message-list";
import { StatsBar } from "@/components/email/stats-bar";

export default function InboxPage() {
	const { currentUser } = useUser();

	if (!currentUser) return null;

	return (
		<div className="flex flex-col gap-4">
			<StatsBar email={currentUser.email} />
			<MessageList
				email={currentUser.email}
				folder="inbox"
				title="Inbox"
			/>
		</div>
	);
}
