"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { useNotificationPreference } from "@/hooks/use-notification-preference";

export function useMailStream() {
	const { currentUser } = useUser();
	const { enabled: notifEnabled } = useNotificationPreference();
	const router = useRouter();
	const seenIds = useRef<Set<string>>(new Set());

	useEffect(() => {
		if (!currentUser) return;
		let cancelled = false;
		let es: EventSource | null = null;

		function connect() {
			es = new EventSource("/api/events");
			es.onmessage = (e) => {
				if (cancelled) return;
				try {
					const data = JSON.parse(e.data);
					if (data.type === "new-mail" && Array.isArray(data.items)) {
						for (const item of data.items) {
							if (seenIds.current.has(item.id)) continue;
							seenIds.current.add(item.id);
							if (notifEnabled) {
								toast.success(`New message from ${item.from}`, {
									description: item.subject,
									action: {
										label: "Open",
										onClick: () => router.push(`/dashboard/message/${item.id}`),
									},
								});
							}
						}
						router.refresh();
					} else if (data.type === "log-updated") {
						router.refresh();
					}
				} catch {
					// ignore parse errors
				}
			};
			es.onerror = () => {
				es?.close();
				if (!cancelled) setTimeout(connect, 5_000);
			};
		}

		connect();
		return () => {
			cancelled = true;
			es?.close();
		};
	}, [currentUser, router, notifEnabled]);
}
