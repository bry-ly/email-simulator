"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types";
import { toast } from "sonner";

interface UserContextValue {
	currentUser: User | null;
	users: User[];
	setCurrentUser: (user: User) => void;
	logout: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [currentUser, setCurrentUserState] = useState<User | null>(null);
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		fetch("/api/users")
			.then((res) => res.json())
			.then((data: User[]) => {
				setUsers(data);
				const savedId = localStorage.getItem("currentUserId");
				const found = data.find((u) => u.id === savedId);
				if (found) {
					setCurrentUserState(found);
				} else if (data.length > 0) {
					setCurrentUserState(data[0]);
					localStorage.setItem("currentUserId", data[0].id);
				}
			});
	}, []);

	function setCurrentUser(user: User) {
		setCurrentUserState(user);
		localStorage.setItem("currentUserId", user.id);
	}

	function logout() {
		const name = currentUser?.name ?? "User";
		setCurrentUserState(null);
		localStorage.removeItem("currentUserId");
		toast.success(`Logged out — See you, ${name}!`);
		window.location.href = "/login";
	}

	return (
		<UserContext.Provider value={{ currentUser, users, setCurrentUser, logout }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser must be used within UserProvider");
	return ctx;
}
