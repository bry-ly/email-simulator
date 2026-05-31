"use client";

import { useEffect, useState } from "react";
import type { Message } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
import { ArrowRight02Icon, Delete01Icon, ArchiveRestoreIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface MessageListProps {
	email: string;
	folder: Message["folder"];
	title: string;
}

export function MessageList({ email, folder, title }: MessageListProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchMessages();
	}, [email, folder]);

	async function fetchMessages() {
		setLoading(true);
		try {
			const res = await fetch(
				`/api/messages?email=${encodeURIComponent(email)}&folder=${folder}`
			);
			const data = await res.json();
			setMessages(data);
		} catch {
			console.error("Failed to fetch messages");
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete(messageId: string) {
		try {
			const { moveToTrashAction } = await import("@/actions/message.actions");
			await moveToTrashAction(email, messageId);
			toast.success("Message moved to trash");
			fetchMessages();
		} catch {
			toast.error("Failed to delete message");
		}
	}

	async function handleRestore(messageId: string) {
		try {
			const { restoreFromTrashAction } = await import("@/actions/message.actions");
			await restoreFromTrashAction(email, messageId);
			toast.success("Message restored");
			fetchMessages();
		} catch {
			toast.error("Failed to restore message");
		}
	}

	async function handlePermanentDelete(messageId: string) {
		try {
			const { permanentDeleteAction } = await import("@/actions/message.actions");
			await permanentDeleteAction(email, messageId);
			toast.success("Message permanently deleted");
			fetchMessages();
		} catch {
			toast.error("Failed to delete message");
		}
	}

	if (loading) {
		return (
			<Card className="shadow-none dark:ring-0">
				<CardHeader className="border-b">
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex items-center justify-center text-muted-foreground text-sm">
						Loading messages...
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="gap-0 shadow-none dark:ring-0">
			<CardHeader className="border-b">
				<CardTitle className="flex items-center justify-between">
					<span>{title}</span>
					<Badge variant="secondary">{messages.length}</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				{messages.length === 0 ? (
					<div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
						No messages in this folder.
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="pl-6">
									{folder === "outbox" || folder === "drafts" ? "To" : "From"}
								</TableHead>
								<TableHead>Subject</TableHead>
								<TableHead className="hidden sm:table-cell">Date</TableHead>
								<TableHead className="pr-6 text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{messages.map((msg) => (
								<TableRow
									key={msg.id}
									className={`h-14 ${!msg.read && folder === "inbox" ? "font-semibold" : ""}`}
								>
									<TableCell className="max-w-36 truncate pl-6 font-medium">
										{folder === "outbox" || folder === "drafts" ? msg.to : msg.from}
									</TableCell>
									<TableCell className="max-w-48">
										<Link
											href={`/dashboard/message/${msg.id}`}
											className="line-clamp-1 text-sm hover:underline"
										>
											{msg.subject || "(No subject)"}
										</Link>
									</TableCell>
									<TableCell className="hidden text-muted-foreground text-sm sm:table-cell">
										{formatDate(msg.timestamp)}
									</TableCell>
									<TableCell className="pr-6 text-right">
										<div className="flex items-center justify-end gap-1">
											{folder === "trash" ? (
												<>
													<Button
														size="icon-xs"
														variant="ghost"
														onClick={() => handleRestore(msg.id)}
													>
														<HugeiconsIcon icon={ArchiveRestoreIcon} strokeWidth={2} className="size-3.5" />
													</Button>
													<AlertDialog>
														<AlertDialogTrigger
															render={
																<Button size="icon-xs" variant="ghost" />
															}
														>
															<HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="size-3.5 text-destructive" />
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>Permanently delete?</AlertDialogTitle>
																<AlertDialogDescription>
																	This action cannot be undone. The message will be permanently removed.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction
																	variant="destructive"
																	onClick={() => handlePermanentDelete(msg.id)}
																>
																	Delete
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</>
											) : (
												<>
													<Link href={`/dashboard/message/${msg.id}`}>
														<Button size="icon-xs" variant="ghost">
															<HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} className="size-3.5" />
														</Button>
													</Link>
													{folder !== "drafts" && (
													<AlertDialog>
														<AlertDialogTrigger
															render={
																<Button size="icon-xs" variant="ghost" />
															}
														>
																<HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
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
																<AlertDialogAction onClick={() => handleDelete(msg.id)}>
																	Move to trash
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
													)}
												</>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
