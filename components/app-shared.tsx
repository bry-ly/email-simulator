"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	InboxIcon,
	MailSend01Icon,
	Delete01Icon,
	File01Icon,
	Tag01Icon,
} from "@hugeicons/core-free-icons";
import { useUser } from "@/contexts/user-context";
import { getFolderCountsAction, getLabelsAction } from "@/actions/message.actions";

export type SidebarNavItem = {
	title: string;
	path?: string;
	icon?: React.ReactNode;
	isActive?: boolean;
	badge?: number;
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
};

function buildGroups(unread: number, drafts: number, labels: string[]): SidebarNavGroup[] {
	const groups: SidebarNavGroup[] = [
		{
			label: "Mail",
			items: [
				{
					title: "Inbox",
					path: "/dashboard/inbox",
					icon: <HugeiconsIcon icon={InboxIcon} strokeWidth={2} />,
					badge: unread > 0 ? unread : undefined,
				},
				{
					title: "Outbox",
					path: "/dashboard/outbox",
					icon: <HugeiconsIcon icon={MailSend01Icon} strokeWidth={2} />,
				},
				{
					title: "Drafts",
					path: "/dashboard/drafts",
					icon: <HugeiconsIcon icon={File01Icon} strokeWidth={2} />,
					badge: drafts > 0 ? drafts : undefined,
				},
				{
					title: "Trash",
					path: "/dashboard/trash",
					icon: <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />,
				},
			],
		},
	];

	if (labels.length > 0) {
		groups.push({
			label: "Labels",
			items: labels.map((label) => ({
				title: label,
				path: `/dashboard/labels/${encodeURIComponent(label)}`,
				icon: <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} />,
			})),
		});
	}

	return groups;
}

export function useNavGroups(): SidebarNavGroup[] {
	const { currentUser } = useUser();
	const [unread, setUnread] = useState(0);
	const [drafts, setDrafts] = useState(0);
	const [labels, setLabels] = useState<string[]>([]);

	useEffect(() => {
		if (!currentUser) return;
		let cancelled = false;
		const email = currentUser.email;

		async function refresh() {
			try {
				const [counts, labelList] = await Promise.all([
					getFolderCountsAction(email),
					getLabelsAction(email),
				]);
				if (cancelled) return;
				setUnread(counts.unread);
				setDrafts(counts.drafts);
				setLabels(labelList);
			} catch {
				// silent
			}
		}

		refresh();
		const id = setInterval(() => {
			if (document.visibilityState === "visible") refresh();
		}, 5_000);
		return () => {
			cancelled = true;
			clearInterval(id);
		};
	}, [currentUser]);

	return buildGroups(unread, drafts, labels);
}

export function NavGroupsStatic() {
	const groups = useNavGroups();
	return groups;
}
