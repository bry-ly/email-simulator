import { readJson, writeJson } from "./storage";
import type { User } from "@/types";

const AVATAR_COLORS = [
	"#6366f1", "#f59e0b", "#10b981", "#ec4899",
	"#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4",
];

export function getUsers(): User[] {
	return readJson<User[]>("users.json");
}

export function getUserById(id: string): User | undefined {
	return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
	return getUsers().find((u) => u.email === email);
}

export function createUser(name: string, email: string): User {
	const users = getUsers();
	const id = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
	if (users.some((u) => u.id === id || u.email === email)) {
		throw new Error("User already exists");
	}
	const user: User = {
		id,
		name,
		email,
		avatarColor: AVATAR_COLORS[users.length % AVATAR_COLORS.length],
	};
	users.push(user);
	writeJson("users.json", users);
	return user;
}
