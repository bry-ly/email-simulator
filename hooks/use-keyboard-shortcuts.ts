"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export interface ShortcutMap {
	[key: string]: () => void;
}

export function useKeyboardShortcuts(map: ShortcutMap, enabled = true) {
	useEffect(() => {
		if (!enabled) return;
		function handler(e: KeyboardEvent) {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			const target = e.target as HTMLElement | null;
			if (target) {
				const tag = target.tagName;
				if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
			}
			const action = map[e.key.toLowerCase()];
			if (action) {
				e.preventDefault();
				action();
			}
		}
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [map, enabled]);
}

export function useGlobalShortcuts(onOpenSettings: () => void) {
	const router = useRouter();
	useKeyboardShortcuts({
		c: () => router.push("/dashboard/compose"),
		g: () => router.push("/dashboard/inbox"),
		",": onOpenSettings,
		"?": onOpenSettings,
	}, true);
}
