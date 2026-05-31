import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	InboxIcon,
	MailSend01Icon,
	PencilEdit01Icon,
	Archive01Icon,
	Delete01Icon,
	File01Icon,
	Clock01Icon,
} from "@hugeicons/core-free-icons";

export type SidebarNavItem = {
	title: string;
	path?: string;
	icon?: ReactNode;
	isActive?: boolean;
	badge?: number;
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
	{
		label: "Mail",
		items: [
			{
				title: "Inbox",
				path: "/dashboard/inbox",
				icon: <HugeiconsIcon icon={InboxIcon} strokeWidth={2} />,
			},
			{
				title: "Outbox",
				path: "/dashboard/outbox",
				icon: <HugeiconsIcon icon={MailSend01Icon} strokeWidth={2} />,
			},
			{
				title: "Compose",
				path: "/dashboard/compose",
				icon: <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} />,
			},
			{
				title: "Drafts",
				path: "/dashboard/drafts",
				icon: <HugeiconsIcon icon={File01Icon} strokeWidth={2} />,
			},
			{
				title: "Trash",
				path: "/dashboard/trash",
				icon: <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />,
			},
		],
	},
	{
		label: "Logs",
		items: [
			{
				title: "Activity Logs",
				path: "/dashboard/logs",
				icon: <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />,
			},
		],
	},
];

export const navLinks: SidebarNavItem[] = navGroups.flatMap((group) => group.items);
