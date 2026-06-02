"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ComposeDialog } from "@/components/compose/compose-dialog";

export interface ComposePrefill {
	to?: string;
	subject?: string;
	body?: string;
	draftId?: string;
}

interface ComposeContextValue {
	open: (prefill?: ComposePrefill) => void;
	close: () => void;
}

const ComposeContext = createContext<ComposeContextValue | null>(null);

export function ComposeProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [prefill, setPrefill] = useState<ComposePrefill>({});

	return (
		<ComposeContext.Provider
			value={{
				open: (next) => {
					setPrefill(next ?? {});
					setOpen(true);
				},
				close: () => setOpen(false),
			}}
		>
			{children}
			<ComposeDialog open={open} onOpenChange={setOpen} prefill={prefill} />
		</ComposeContext.Provider>
	);
}

export function useComposeDialog() {
	const ctx = useContext(ComposeContext);
	if (!ctx) throw new Error("useComposeDialog must be used within ComposeProvider");
	return ctx;
}
