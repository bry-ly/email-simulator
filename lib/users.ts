import { db } from "./db";
import { users } from "./db/schema";
import { eq, or } from "drizzle-orm";
import type { User } from "@/types";

const AVATAR_COLORS = [
	"#6366f1", "#f59e0b", "#10b981", "#ec4899",
	"#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4",
];

export async function getUsers(): Promise<User[]> {
	return db.select().from(users);
}

export async function getUserById(id: string): Promise<User | undefined> {
	const result = await db.select().from(users).where(eq(users.id, id));
	return result[0];
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
	const result = await db.select().from(users).where(eq(users.email, email));
	return result[0];
}

export async function createUser(name: string, email: string): Promise<User> {
	const id = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
	const existing = await db.select().from(users).where(
		or(eq(users.id, id), eq(users.email, email))
	);
	if (existing.length > 0) {
		throw new Error("User already exists");
	}
	const countResult = await db.select({ count: users.id }).from(users);
	const user: User = {
		id,
		name,
		email,
		avatarColor: AVATAR_COLORS[countResult.length % AVATAR_COLORS.length],
	};
	await db.insert(users).values(user);
	return user;
}
