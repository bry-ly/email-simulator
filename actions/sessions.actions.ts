"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export interface SessionRow {
	id: string;
	token: string;
	expiresAt: Date;
	createdAt: Date;
	ipAddress: string | null;
	userAgent: string | null;
}

export async function listSessionsAction(): Promise<SessionRow[]> {
	const res = await auth.api.listSessions({ headers: await headers() });
	return (res as unknown as SessionRow[]) ?? [];
}

export async function revokeSessionAction(token: string) {
	await auth.api.revokeSession({
		headers: await headers(),
		body: { token },
	});
	return { ok: true } as const;
}
