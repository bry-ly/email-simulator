"use client";

import { useUser } from "@/contexts/user-context";
import { MessageReader } from "@/components/email/message-reader";
import { useParams } from "next/navigation";

export default function MessagePage() {
	const { currentUser } = useUser();
	const params = useParams();
	const messageId = params.id as string;

	if (!currentUser) return null;

	return (
		<MessageReader
			email={currentUser.email}
			messageId={messageId}
		/>
	);
}
