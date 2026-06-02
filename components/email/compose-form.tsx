"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailSend01Icon, SaveIcon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { sendMessageAction, saveDraftAction } from "@/actions/message.actions";

const sendSchema = z.object({
	to: z.string().email("Please enter a valid email address"),
	subject: z.string().min(1, "Subject is required").max(255, "Subject is too long"),
	body: z.string().min(1, "Message body is required").max(50_000, "Message is too long"),
});

const draftSchema = z.object({
	to: z.string().email("Please enter a valid email address").or(z.literal("")),
	subject: z.string().max(255, "Subject is too long"),
	body: z.string().max(50_000, "Message is too long"),
});

type SendFormData = z.infer<typeof sendSchema>;

interface ComposeFormProps {
	currentUserEmail: string;
	initialTo?: string;
	initialSubject?: string;
	initialBody?: string;
	draftId?: string;
	onSent?: () => void;
	onDraftSaved?: () => void;
}

export function ComposeForm({
	currentUserEmail,
	initialTo = "",
	initialSubject = "",
	initialBody = "",
	draftId,
	onSent,
	onDraftSaved,
}: ComposeFormProps) {
	const [sending, setSending] = useState(false);
	const [saving, setSaving] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<SendFormData>({
		resolver: zodResolver(sendSchema),
		defaultValues: {
			to: initialTo,
			subject: initialSubject,
			body: initialBody,
		},
	});

	async function onSend(data: SendFormData) {
		setSending(true);
		try {
			await sendMessageAction(currentUserEmail, data.to, data.subject, data.body);
			reset();
			toast.success("Message sent successfully");
			onSent?.();
		} catch {
			toast.error("Failed to send message");
		} finally {
			setSending(false);
		}
	}

	async function onSaveDraft() {
		const data = draftSchema.parse({
			to: (document.getElementById("to") as HTMLInputElement | null)?.value ?? "",
			subject: (document.getElementById("subject") as HTMLInputElement | null)?.value ?? "",
			body: (document.getElementById("body") as HTMLTextAreaElement | null)?.value ?? "",
		});
		setSaving(true);
		try {
			await saveDraftAction(
				currentUserEmail,
				data.subject,
				data.body,
				data.to || undefined,
				draftId
			);
			toast.success("Draft saved");
			onDraftSaved?.();
		} catch {
			toast.error("Failed to save draft");
		} finally {
			setSaving(false);
		}
	}

	return (
		<form className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<label className="text-foreground text-sm font-medium" htmlFor="to">
					To
				</label>
				<Input
					id="to"
					placeholder="recipient@sim.mail"
					{...register("to")}
				/>
				{errors.to && (
					<p className="text-destructive text-xs">{errors.to.message}</p>
				)}
			</div>
			<div className="flex flex-col gap-1.5">
				<label className="text-foreground text-sm font-medium" htmlFor="subject">
					Subject
				</label>
				<Input
					id="subject"
					placeholder="Enter subject"
					{...register("subject")}
				/>
				{errors.subject && (
					<p className="text-destructive text-xs">{errors.subject.message}</p>
				)}
			</div>
			<div className="flex flex-col gap-1.5">
				<label className="text-foreground text-sm font-medium" htmlFor="body">
					Message
				</label>
				<Textarea
					id="body"
					placeholder="Write your message..."
					className="min-h-[200px]"
					{...register("body")}
				/>
				{errors.body && (
					<p className="text-destructive text-xs">{errors.body.message}</p>
				)}
			</div>
			<div className="flex items-center gap-2">
				<Button
					type="button"
					onClick={handleSubmit(onSend)}
					disabled={sending}
				>
					<HugeiconsIcon icon={MailSend01Icon} strokeWidth={2} className="size-4" />
					{sending ? "Sending..." : "Send"}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={onSaveDraft}
					disabled={saving}
				>
					<HugeiconsIcon icon={SaveIcon} strokeWidth={2} className="size-4" />
					{saving ? "Saving..." : "Save Draft"}
				</Button>
			</div>
		</form>
	);
}
