"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailSend01Icon, SaveIcon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

const composeSchema = z.object({
	to: z.string().email("Please enter a valid email address"),
	subject: z.string().min(1, "Subject is required"),
	body: z.string().min(1, "Message body is required"),
});

type ComposeFormData = z.infer<typeof composeSchema>;

interface ComposeFormProps {
	currentUserEmail: string;
	onSent?: () => void;
}

export function ComposeForm({ currentUserEmail, onSent }: ComposeFormProps) {
	const [sending, setSending] = useState(false);
	const [saving, setSaving] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ComposeFormData>({
		resolver: zodResolver(composeSchema),
	});

	async function onSend(data: ComposeFormData) {
		setSending(true);
		try {
			const { sendMessageAction } = await import("@/actions/message.actions");
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

	async function onSaveDraft(data: ComposeFormData) {
		setSaving(true);
		try {
			const { saveDraftAction } = await import("@/actions/message.actions");
			await saveDraftAction(currentUserEmail, data.subject, data.body, data.to);
			reset();
			toast.success("Draft saved");
			onSent?.();
		} catch {
			toast.error("Failed to save draft");
		} finally {
			setSaving(false);
		}
	}

	return (
		<Card className="shadow-none dark:ring-0">
			<CardHeader className="border-b">
				<CardTitle>Compose Message</CardTitle>
			</CardHeader>
			<CardContent className="p-4 md:p-6">
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
							onClick={handleSubmit(onSaveDraft)}
							disabled={saving}
						>
							<HugeiconsIcon icon={SaveIcon} strokeWidth={2} className="size-4" />
							{saving ? "Saving..." : "Save Draft"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
