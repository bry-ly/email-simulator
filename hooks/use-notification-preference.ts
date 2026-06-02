"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "simmail.notifications";

function readInitial(): boolean {
	if (typeof window === "undefined") return true;
	const stored = window.localStorage.getItem(KEY);
	return stored === null ? true : stored === "true";
}

export function useNotificationPreference() {
	const [enabled, setEnabled] = useState(readInitial);

	useEffect(() => {
		function onStorage(e: StorageEvent) {
			if (e.key === KEY && e.newValue !== null) setEnabled(e.newValue === "true");
		}
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	const toggle = useCallback((next: boolean) => {
		setEnabled(next);
		window.localStorage.setItem(KEY, String(next));
		window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: String(next) }));
	}, []);

	return { enabled, toggle };
}
