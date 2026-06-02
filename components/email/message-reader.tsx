"use client";

import { useCallback, useEffect, useState } from "react";
import { ViewTransition } from "react";
import type { Message } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Delete01Icon, MailReply01Icon, Tag01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
	markAsReadAction,
	moveToTrashAction,
	getMessageAction,
	addLabelAction,
	removeLabelAction,
} from "@/actions/message.actions";
import { useComposeDialog } from "@/contexts/compose-context";

interface MessageReaderProps {
	email: string;
	messageId: string;
	initialMessage?: Message;
}

export function MessageReader({ email, messageId, initialMessage }: MessageReaderProps) {
	const compose = useComposeDialog();
	const [message, setMessage] = useState<Message | null>(initialMessage ?? null);
	const [loading, setLoading] = useState(!initialMessage);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [labelInput, setLabelInput] = useState("");
	const [addingLabel, setAddingLabel] = useState(false);
	const router = useRouter();

	function openReply() {
		if (!message) return;
		const quoted = message.body
			.split("\n")
			.map((line) => `> ${line}`)
			.join("\n");
		compose.open({
			to: message.from,
			subject: message.subject.toLowerCase().startsWith("re:") ? message.subject : `Re: ${message.subject}`,
			body: `\n\nOn ${formatDate(message.timestamp)} ${message.from} wrote:\n${quoted}`,
		});
	}

	const fetchMessage = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getMessageAction(email, messageId);
			if (data) {
				setMessage(data);
				if (data.folder === "inbox" && !data.read) {
					const updated = await markAsReadAction(email, messageId);
					if (updated) setMessage({ ...data, read: true });
				}
			}
		} catch {
			console.error("Failed to fetch message");
		} finally {
			setLoading(false);
		}
	}, [email, messageId]);

	useEffect(() => {
		if (initialMessage) return;
		fetchMessage();
	}, [fetchMessage, initialMessage]);

	async function handleDelete() {
		setDeleteDialogOpen(false);
		try {
			await moveToTrashAction(email, messageId);
			toast.success("Message moved to trash");
			router.push(`/dashboard/inbox`);
		} catch {
			toast.error("Failed to delete message");
		}
	}

	async function handleAddLabel(e: React.FormEvent) {
		e.preventDefault();
		const value = labelInput.trim().toLowerCase();
		if (!value || !message) return;
		if (message.labels.includes(value)) {
			setLabelInput("");
			return;
		}
		setAddingLabel(true);
		try {
			const updated = await addLabelAction(email, messageId, value);
			if (updated) setMessage({ ...message, labels: updated.labels });
			setLabelInput("");
		} catch {
			toast.error("Failed to add label");
		} finally {
			setAddingLabel(false);
		}
	}

	async function handleRemoveLabel(label: string) {
		if (!message) return;
		try {
			const updated = await removeLabelAction(email, messageId, label);
			if (updated) setMessage({ ...message, labels: updated.labels });
		} catch {
			toast.error("Failed to remove label");
		}
	}

	if (loading) {
		return (
			<Card className="shadow-none dark:ring-0">
				<CardContent className="p-6">
					<div className="flex items-center justify-center text-muted-foreground text-sm">
						Loading message...
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!message) {
		return (
			<Card className="shadow-none dark:ring-0">
				<CardContent className="p-6">
					<div className="flex items-center justify-center text-muted-foreground text-sm">
						Message not found.
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="shadow-none dark:ring-0">
			<CardHeader className="border-b">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button size="icon-sm" variant="ghost" nativeButton={false} render={<Link href={`/dashboard/${message.folder}`} />}>
							<HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
						</Button>
						<ViewTransition name={`msg-subject-${message.id}`} share="morph-message" default="none">
							<h2 className="font-semibold text-lg">{message.subject}</h2>
						</ViewTransition>
						{message.folder === "inbox" && !message.read && (
							<Badge variant="secondary">New</Badge>
						)}
					</div>
					<div className="flex items-center gap-1">
						{message.folder === "inbox" && (
							<Button
								size="icon-sm"
								variant="ghost"
								onClick={openReply}
								aria-label="Reply"
							>
								<HugeiconsIcon icon={MailReply01Icon} strokeWidth={2} className="size-4" />
							</Button>
						)}
						<AlertDialog
							open={deleteDialogOpen}
							onOpenChange={setDeleteDialogOpen}
						>
							<AlertDialogTrigger
								render={
									<Button
										size="icon-sm"
										variant="ghost"
										onClick={() => setDeleteDialogOpen(true)}
									/>
								}
							>
								<HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Move to trash?</AlertDialogTitle>
									<AlertDialogDescription>
										This message will be moved to the trash folder.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={handleDelete}>
										Move to trash
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-4 md:p-6">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-4 text-sm">
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">From:</span>
							<span className="font-medium">{message.from}</span>
						</div>
						<Separator orientation="vertical" className="h-4" />
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">To:</span>
							<span className="font-medium">{message.to}</span>
						</div>
					</div>
					<div className="text-muted-foreground text-sm">
						{formatDate(message.timestamp)}
					</div>
				<Separator />
				<div className="whitespace-pre-wrap text-sm leading-relaxed">
					{message.body}
				</div>
				<Separator />
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2 text-muted-foreground text-xs">
						<HugeiconsIcon icon={Tag01Icon} strokeWidth={2} className="size-3.5" />
						<span>Labels</span>
					</div>
					<div className="flex flex-wrap items-center gap-1.5">
						{message.labels.length === 0 && (
							<span className="text-muted-foreground text-xs">No labels</span>
						)}
						{message.labels.map((label) => (
							<Badge key={label} variant="secondary" className="gap-1">
								{label}
								<button
									type="button"
									onClick={() => handleRemoveLabel(label)}
									className="opacity-60 hover:opacity-100"
									aria-label={`Remove label ${label}`}
								>
									<HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3" />
								</button>
							</Badge>
						))}
					</div>
					<form onSubmit={handleAddLabel} className="flex items-center gap-2">
						<Input
							value={labelInput}
							onChange={(e) => setLabelInput(e.target.value)}
							placeholder="Add a label…"
							className="h-7 max-w-48 text-xs"
							maxLength={32}
						/>
						<Button
							type="submit"
							size="sm"
							variant="outline"
							disabled={addingLabel || !labelInput.trim()}
						>
							Add
						</Button>
					</form>
				</div>
				</div>
			</CardContent>
		</Card>
	);
}
