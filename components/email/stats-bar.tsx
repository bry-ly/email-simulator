"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { InboxIcon, MailSend01Icon, File01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

interface FolderCounts {
	inbox: number;
	unread: number;
	outbox: number;
	drafts: number;
	trash: number;
}

interface StatsBarProps {
	email: string;
}

export function StatsBar({ email }: StatsBarProps) {
	const [counts, setCounts] = useState<FolderCounts | null>(null);

	useEffect(() => {
		fetch(`/api/messages/counts?email=${encodeURIComponent(email)}`)
			.then((res) => res.json())
			.then(setCounts);
	}, [email]);

	if (!counts) return null;

	const items = [
		{
			label: "Inbox",
			count: counts.inbox,
			unread: counts.unread,
			icon: <HugeiconsIcon icon={InboxIcon} strokeWidth={2} className="size-4" />,
			href: "/dashboard/inbox",
		},
		{
			label: "Outbox",
			count: counts.outbox,
			icon: <HugeiconsIcon icon={MailSend01Icon} strokeWidth={2} className="size-4" />,
			href: "/dashboard/outbox",
		},
		{
			label: "Drafts",
			count: counts.drafts,
			icon: <HugeiconsIcon icon={File01Icon} strokeWidth={2} className="size-4" />,
			href: "/dashboard/drafts",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
			{items.map((item) => (
				<Card key={item.label} className="shadow-none dark:ring-0">
					<CardHeader>
						<CardTitle className="flex items-center justify-between font-normal text-muted-foreground text-xs">
							<span className="flex items-center gap-2">
								{item.icon}
								{item.label}
							</span>
							{item.unread !== undefined && item.unread > 0 && (
								<Badge variant="destructive" className="h-5 px-1.5 text-xs">
									{item.unread}
								</Badge>
							)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Link href={item.href} className="hover:underline">
							<p className="font-semibold text-2xl tabular-nums">{item.count}</p>
							<p className="text-muted-foreground text-xs">messages</p>
						</Link>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
