"use client";

import { useUser } from "@/contexts/user-context";
import { ActivityLog } from "@/components/logs/activity-log";

export default function LogsPage() {
	const { currentUser } = useUser();

	if (!currentUser) return null;

	return <ActivityLog userId={currentUser.email} />;
}
