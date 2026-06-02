"use client";

import { useMailStream } from "@/hooks/use-mail-stream";
import { useGlobalShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useSettingsDialog } from "@/contexts/settings-context";
import { useComposeDialog } from "@/contexts/compose-context";

export function ShortcutsProvider({ children }: { children: React.ReactNode }) {
	const settings = useSettingsDialog();
	const compose = useComposeDialog();
	useGlobalShortcuts({ onOpenSettings: settings.open, onOpenCompose: compose.open });
	useMailStream();
	return <>{children}</>;
}
