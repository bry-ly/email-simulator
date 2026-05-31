"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";
import { AppShell } from "@/components/app-shell";
import { UserProvider } from "@/contexts/user-context";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const userId = localStorage.getItem("currentUserId");
		if (!userId) {
			router.push("/login");
			return;
		}
		fetch("/api/users")
			.then((res) => res.json())
			.then((data: User[]) => {
				const found = data.find((u) => u.id === userId);
				if (!found) {
					router.push("/login");
					return;
				}
				setReady(true);
			});
	}, [router]);

	if (!ready) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p className="text-muted-foreground text-sm">Loading...</p>
			</div>
		);
	}

	return (
		<UserProvider>
			<AppShell>{children}</AppShell>
		</UserProvider>
	);
}
