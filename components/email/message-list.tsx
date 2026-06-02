"use client";

import { useCallback, useEffect, useState } from "react";
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
import {
	ArrowRight02Icon,
	Delete01Icon,
	ArchiveRestoreIcon,
	InboxIcon,
	MailSend01Icon,
	File01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
	moveToTrashAction,
	restoreFromTrashAction,
	permanentDeleteAction,
	getMessagesAction,
	markAllAsReadAction,
	emptyTrashAction,
} from "@/actions/message.actions";
import { EmptyState } from "@/components/email/empty-state";
import { useComposeDialog } from "@/contexts/compose-context";
import type { IconSvgElement } from "@hugeicons/react";

interface MessageListProps {
	email: string;
	folder: Message["folder"];
	title: string;
	initialMessages?: Message[];
}

export function MessageList({ email, folder, title, initialMessages }: MessageListProps) {
	const compose = useComposeDialog();
	const [messages, setMessages] = useState<Message[]>(initialMessages || []);
	const [loading, setLoading] = useState(!initialMessages);
	const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
	const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<string | null>(null);
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [bulkBusy, setBulkBusy] = useState(false);

	const allSelected = messages.length > 0 && selected.size === messages.length;
	const someSelected = selected.size > 0 && !allSelected;

	function toggleOne(id: string) {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}

	function toggleAll() {
		setSelected(allSelected ? new Set() : new Set(messages.map((m) => m.id)));
	}

	async function bulkTrash() {
		setBulkBusy(true);
		try {
			await Promise.all(
				Array.from(selected).map((id) => moveToTrashAction(email, id))
			);
			toast.success(`Moved ${selected.size} message${selected.size === 1 ? "" : "s"} to trash`);
			setMessages((prev) => prev.filter((m) => !selected.has(m.id)));
			setSelected(new Set());
		} catch {
			toast.error("Failed to bulk delete");
			fetchMessages();
		} finally {
			setBulkBusy(false);
		}
	}

	const fetchMessages = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getMessagesAction(email, folder);
			setMessages(data);
		} catch {
			toast.error("Failed to load messages");
		} finally {
			setLoading(false);
		}
	}, [email, folder]);

	useEffect(() => {
		if (!initialMessages) {
			fetchMessages();
		}
	}, [fetchMessages, initialMessages]);

	async function handleMarkAllRead() {
		try {
			const n = await markAllAsReadAction(email);
			toast.success(n > 0 ? `Marked ${n} message${n === 1 ? "" : "s"} as read` : "Nothing to mark");
			fetchMessages();
		} catch {
			toast.error("Failed to mark all read");
		}
	}

	async function handleEmptyTrash() {
		try {
			const n = await emptyTrashAction(email);
			toast.success(n > 0 ? `Emptied trash (${n})` : "Trash is already empty");
			fetchMessages();
		} catch {
			toast.error("Failed to empty trash");
		}
	}

	async function handleDelete(messageId: string) {
		setDeleteTarget(null);
		try {
			await moveToTrashAction(email, messageId);
			toast.success("Message moved to trash");
			setMessages((prev) => prev.filter((m) => m.id !== messageId));
		} catch {
			toast.error("Failed to delete message");
			fetchMessages();
		}
	}

	async function handleRestore(messageId: string) {
		try {
			await restoreFromTrashAction(email, messageId);
			toast.success("Message restored");
			setMessages((prev) => prev.filter((m) => m.id !== messageId));
		} catch {
			toast.error("Failed to restore message");
			fetchMessages();
		}
	}

	async function handlePermanentDelete(messageId: string) {
		setPermanentDeleteTarget(null);
		try {
			await permanentDeleteAction(email, messageId);
			toast.success("Message permanently deleted");
			setMessages((prev) => prev.filter((m) => m.id !== messageId));
		} catch {
			toast.error("Failed to delete message");
			fetchMessages();
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

	const emptyCopy: Record<typeof folder, { icon: IconSvgElement; title: string; description: string; actionLabel?: string; onAction?: () => void }> = {
		inbox: {
			icon: InboxIcon,
			title: "Your inbox is empty",
			description: "When someone sends you a message, it will show up here.",
			actionLabel: "Compose your first email",
			onAction: () => compose.open(),
		},
		outbox: {
			icon: MailSend01Icon,
			title: "No sent messages",
			description: "Messages you send will appear in your outbox.",
			actionLabel: "Compose now",
			onAction: () => compose.open(),
		},
		drafts: {
			icon: File01Icon,
			title: "No drafts",
			description: "Save a message as draft to come back to it later.",
			actionLabel: "Start a draft",
			onAction: () => compose.open(),
		},
		trash: {
			icon: Delete01Icon,
			title: "Trash is empty",
			description: "Deleted messages will appear here before being permanently removed.",
		},
	};

	return (
		<Card className="gap-0 shadow-none dark:ring-0">
			<CardHeader className="flex flex-row items-center justify-between gap-2 border-b">
				<CardTitle className="flex items-center gap-2">
					<span>{title}</span>
					<Badge variant="secondary">{messages.length}</Badge>
				</CardTitle>
				<div className="flex items-center gap-2">
					{selected.size > 0 && folder !== "trash" && (
						<Button
							size="sm"
							variant="outline"
							onClick={bulkTrash}
							disabled={bulkBusy}
						>
							Move {selected.size} to trash
						</Button>
					)}
					{selected.size > 0 && (
						<Button
							size="sm"
							variant="ghost"
							onClick={() => setSelected(new Set())}
						>
							Clear
						</Button>
					)}
					{folder === "inbox" && messages.some((m) => !m.read) && (
						<Button size="sm" variant="ghost" onClick={handleMarkAllRead}>
							Mark all as read
						</Button>
					)}
					{folder === "trash" && messages.length > 0 && (
						<Button
							size="sm"
							variant="ghost"
							className="text-destructive hover:text-destructive"
							onClick={handleEmptyTrash}
						>
							Empty trash
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-0">
				{messages.length === 0 ? (
					<EmptyState {...emptyCopy[folder]} />
				) : (
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="w-10 pl-6">
									<input
										type="checkbox"
										aria-label="Select all"
										className="size-4 cursor-pointer accent-primary"
										checked={allSelected}
										ref={(el) => {
											if (el) el.indeterminate = someSelected;
										}}
										onChange={toggleAll}
									/>
								</TableHead>
								<TableHead>
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
									className={`h-14 ${!msg.read && folder === "inbox" ? "font-semibold" : ""} ${selected.has(msg.id) ? "bg-muted/50" : ""}`}
								>
									<TableCell className="w-10 pl-6">
										<input
											type="checkbox"
											aria-label={`Select ${msg.subject}`}
											className="size-4 cursor-pointer accent-primary"
											checked={selected.has(msg.id)}
											onChange={() => toggleOne(msg.id)}
										/>
									</TableCell>
									<TableCell className="max-w-36 truncate font-medium">
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
													<AlertDialog
														open={permanentDeleteTarget === msg.id}
														onOpenChange={(open) => {
															if (!open) setPermanentDeleteTarget(null);
														}}
													>
														<AlertDialogTrigger
															render={
																<Button
																	size="icon-xs"
																	variant="ghost"
																	onClick={() => setPermanentDeleteTarget(msg.id)}
																/>
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
														<AlertDialog
															open={deleteTarget === msg.id}
															onOpenChange={(open) => {
																if (!open) setDeleteTarget(null);
															}}
														>
															<AlertDialogTrigger
																render={
																	<Button
																		size="icon-xs"
																		variant="ghost"
																		onClick={() => setDeleteTarget(msg.id)}
																	/>
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
