"use client";

import { useCallback, useEffect, useState } from "react";
import type { Message } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft01Icon, Delete01Icon, MailReply01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface MessageReaderProps {
	email: string;
	messageId: string;
}

export function MessageReader({ email, messageId }: MessageReaderProps) {
	const [message, setMessage] = useState<Message | null>(null);
	const [loading, setLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const router = useRouter();

	const fetchMessage = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(
				`/api/messages/${messageId}?email=${encodeURIComponent(email)}`
			);
			if (res.ok) {
				const data = await res.json();
				setMessage(data);
				if (data.folder === "inbox" && !data.read) {
					const { markAsReadAction } = await import("@/actions/message.actions");
					await markAsReadAction(email, messageId);
					setMessage({ ...data, read: true });
				}
			}
		} catch {
			console.error("Failed to fetch message");
		} finally {
			setLoading(false);
		}
	}, [email, messageId]);

	useEffect(() => {
		fetchMessage();
	}, [fetchMessage]);

	async function handleDelete() {
		setDeleteDialogOpen(false);
		try {
			const { moveToTrashAction } = await import("@/actions/message.actions");
			await moveToTrashAction(email, messageId);
			toast.success("Message moved to trash");
			router.push(`/dashboard/inbox`);
		} catch {
			toast.error("Failed to delete message");
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
						<h2 className="font-semibold text-lg">{message.subject}</h2>
						{message.folder === "inbox" && !message.read && (
							<Badge variant="secondary">New</Badge>
						)}
					</div>
					<div className="flex items-center gap-1">
						{message.folder === "inbox" && (
							<Button size="icon-sm" variant="ghost" nativeButton={false} render={<Link href={`/dashboard/compose?reply=${message.id}`} />}>
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
				</div>
			</CardContent>
		</Card>
	);
}
