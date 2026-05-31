"use client";

import { useUser } from "@/contexts/user-context";
import { ComposeForm } from "@/components/email/compose-form";
import { useRouter } from "next/navigation";

export default function ComposePage() {
	const { currentUser } = useUser();
	const router = useRouter();

	if (!currentUser) return null;

	return (
		<ComposeForm
			currentUserEmail={currentUser.email}
			onSent={() => router.push("/dashboard/outbox")}
		/>
	);
}
