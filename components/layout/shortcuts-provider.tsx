"use client";

import { useMailStream } from "@/hooks/use-mail-stream";
import { useGlobalShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useSettingsDialog } from "@/contexts/settings-context";

export function ShortcutsProvider({ children }: { children: React.ReactNode }) {
	const settings = useSettingsDialog();
	useGlobalShortcuts(settings.open);
	useMailStream();
	return <>{children}</>;
}
