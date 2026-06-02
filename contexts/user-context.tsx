"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { User } from "@/types";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface UserContextValue {
	currentUser: User | null;
	setCurrentUser: (user: User) => void;
	refreshUser: () => Promise<void>;
	logout: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({
	children,
	initialUser,
}: {
	children: React.ReactNode;
	initialUser: User | null;
}) {
	const [currentUser, setCurrentUserState] = useState<User | null>(initialUser);

	const setCurrentUser = useCallback((user: User) => setCurrentUserState(user), []);

	const refreshUser = useCallback(async () => {
		const { data } = await authClient.getSession();
		if (!data?.user) return;
		setCurrentUserState({
			id: data.user.id,
			name: data.user.name,
			email: data.user.email,
			avatarColor: (data.user as { avatarColor?: string }).avatarColor ?? "#6366f1",
		});
	}, []);

	async function logout() {
		const name = currentUser?.name ?? "User";
		await authClient.signOut();
		setCurrentUserState(null);
		toast.success(`Logged out — See you, ${name}!`);
		window.location.href = "/login";
	}

	return (
		<UserContext.Provider value={{ currentUser, setCurrentUser, refreshUser, logout }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser must be used within UserProvider");
	return ctx;
}
