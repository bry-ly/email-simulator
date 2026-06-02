"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listSessionsAction, revokeSessionAction, type SessionRow } from "@/actions/sessions.actions";
import { Button } from "@/components/ui/button";

function formatDate(d: Date) {
	return new Date(d).toLocaleString();
}

export function SessionsList() {
	const [sessions, setSessions] = useState<SessionRow[] | null>(null);
	const [revoking, setRevoking] = useState<string | null>(null);

	async function load() {
		const data = await listSessionsAction();
		setSessions(data);
	}

	useEffect(() => {
		load();
	}, []);

	async function revoke(token: string) {
		setRevoking(token);
		try {
			const res = await revokeSessionAction(token);
			if ("error" in res) toast.error(res.error);
			else {
				toast.success("Session revoked");
				await load();
			}
		} catch {
			toast.error("Failed to revoke");
		} finally {
			setRevoking(null);
		}
	}

	if (sessions === null) return <p className="text-muted-foreground text-sm">Loading sessions...</p>;
	if (sessions.length === 0) return <p className="text-muted-foreground text-sm">No active sessions.</p>;

	return (
		<div className="space-y-2">
			{sessions.map((s) => (
				<div key={s.id} className="flex items-start justify-between gap-3 rounded-md border p-3">
					<div className="min-w-0 space-y-0.5">
						<p className="truncate font-mono text-xs">{s.userAgent ?? "Unknown device"}</p>
						<p className="text-muted-foreground text-xs">
							{s.ipAddress ?? "Unknown IP"} · expires {formatDate(s.expiresAt)}
						</p>
					</div>
					<Button
						size="sm"
						variant="outline"
						disabled={revoking === s.token}
						onClick={() => revoke(s.token)}
					>
						{revoking === s.token ? "Revoking..." : "Revoke"}
					</Button>
				</div>
			))}
		</div>
	);
}
