"use client";

import { useEffect, useState } from "react";
import type { MessageLog } from "@/types";
import { Badge } from "@/components/ui/badge";
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
import { HugeiconsIcon } from "@hugeicons/react";
import {
	MailSend01Icon,
	InboxIcon,
	EyeIcon,
	Delete01Icon,
	Archive01Icon,
} from "@hugeicons/core-free-icons";
import { formatDate } from "@/lib/utils";

interface ActivityLogProps {
	userId?: string;
}

const actionConfig: Record<
	MessageLog["action"],
	{ label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
	sent: {
		label: "Sent",
		icon: <HugeiconsIcon icon={MailSend01Icon} strokeWidth={2} className="size-3" />,
		variant: "secondary",
	},
	received: {
		label: "Received",
		icon: <HugeiconsIcon icon={InboxIcon} strokeWidth={2} className="size-3" />,
		variant: "default",
	},
	read: {
		label: "Read",
		icon: <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3" />,
		variant: "outline",
	},
	deleted: {
		label: "Deleted",
		icon: <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="size-3" />,
		variant: "destructive",
	},
	archived: {
		label: "Archived",
		icon: <HugeiconsIcon icon={Archive01Icon} strokeWidth={2} className="size-3" />,
		variant: "secondary",
	},
};

export function ActivityLog({ userId }: ActivityLogProps) {
	const [logs, setLogs] = useState<MessageLog[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchLogs();
	}, [userId]);

	async function fetchLogs() {
		setLoading(true);
		try {
			const url = userId
				? `/api/logs?userId=${encodeURIComponent(userId)}`
				: "/api/logs";
			const res = await fetch(url);
			const data = await res.json();
			setLogs(data);
		} catch {
			console.error("Failed to fetch logs");
		} finally {
			setLoading(false);
		}
	}

	if (loading) {
		return (
			<Card className="shadow-none dark:ring-0">
				<CardHeader className="border-b">
					<CardTitle>Activity Logs</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex items-center justify-center text-muted-foreground text-sm">
						Loading logs...
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="gap-0 shadow-none dark:ring-0">
			<CardHeader className="border-b">
				<CardTitle className="flex items-center justify-between">
					<span>Activity Logs</span>
					<Badge variant="secondary">{logs.length}</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				{logs.length === 0 ? (
					<div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
						No activity logs found.
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="pl-6">Action</TableHead>
								<TableHead>Details</TableHead>
								<TableHead className="hidden sm:table-cell">User</TableHead>
								<TableHead className="pr-6 text-right">Time</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{logs.map((log) => {
								const config = actionConfig[log.action];
								return (
									<TableRow key={log.id} className="h-12">
										<TableCell className="pl-6">
											<Badge variant={config.variant} className="gap-1">
												{config.icon}
												{config.label}
											</Badge>
										</TableCell>
										<TableCell className="max-w-64 truncate text-sm">
											{log.details}
										</TableCell>
										<TableCell className="hidden text-muted-foreground text-sm sm:table-cell">
											{log.userId}
										</TableCell>
										<TableCell className="pr-6 text-right text-muted-foreground text-sm tabular-nums">
											{formatDate(log.timestamp)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
