"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ComposeForm } from "@/components/email/compose-form";
import { useUser } from "@/contexts/user-context";
import type { ComposePrefill } from "@/contexts/compose-context";

interface ComposeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	prefill: ComposePrefill;
}

export function ComposeDialog({ open, onOpenChange, prefill }: ComposeDialogProps) {
	const { currentUser } = useUser();
	const [nonce, setNonce] = useState(0);

	useEffect(() => {
		if (open) setNonce((n) => n + 1);
	}, [open]);

	if (!currentUser) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex max-h-[90vh] w-[min(96vw,720px)] flex-col gap-0 overflow-hidden p-0">
				<DialogHeader className="border-b px-6 py-4">
					<DialogTitle>New message</DialogTitle>
					<DialogDescription>
						Send a message to another SimMail user.
					</DialogDescription>
				</DialogHeader>
				<div className="overflow-y-auto p-4 md:p-6">
					<ComposeForm
						key={nonce}
						currentUserEmail={currentUser.email}
						initialTo={prefill.to}
						initialSubject={prefill.subject}
						initialBody={prefill.body}
						draftId={prefill.draftId}
						onSent={() => onOpenChange(false)}
						onDraftSaved={() => onOpenChange(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
