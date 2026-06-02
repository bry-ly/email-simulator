import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@/types";

export async function requireSession(): Promise<{ user: User; email: string }> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect("/login");
	const user: User = {
		id: session.user.id,
		name: session.user.name,
		email: session.user.email,
		avatarColor: (session.user as { avatarColor?: string }).avatarColor ?? "#6366f1",
	};
	return { user, email: user.email };
}
