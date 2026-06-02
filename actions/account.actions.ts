"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { messages, messageLogs } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export async function updateAvatarColorAction(color: string) {
	if (!HEX.test(color)) return { error: "Invalid color" } as const;
	await auth.api.updateUser({
		headers: await headers(),
		body: { avatarColor: color } as Record<string, string>,
	});
	revalidatePath("/dashboard", "layout");
	return { ok: true } as const;
}

export async function changeEmailAction(newEmail: string) {
	const trimmed = newEmail.trim().toLowerCase();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
		return { error: "Invalid email" } as const;
	}
	await auth.api.changeEmail({
		headers: await headers(),
		body: { newEmail: trimmed },
	});
	revalidatePath("/dashboard", "layout");
	return { ok: true } as const;
}

export async function deleteAccountAction() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) return { error: "Not signed in" } as const;
	const userId = session.user.id;
	const email = session.user.email;

	await db.delete(messageLogs).where(eq(messageLogs.userId, userId));
	await db
		.delete(messages)
		.where(or(eq(messages.from, email), eq(messages.to, email)));
	await auth.api.deleteUser({
		headers: await headers(),
		body: {},
	});
	return { ok: true } as const;
}
