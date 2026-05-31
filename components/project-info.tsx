"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogoIcon } from "@/components/logo";
import { Tree, TreeItem, TreeItemLabel } from "@/components/reui/tree";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import {
	FileIcon,
	FolderIcon,
	FolderOpenIcon,
} from "lucide-react";

interface Item {
	name: string;
	children?: string[];
}

const items: Record<string, Item> = {
	root: {
		name: "text-based-email-simulator",
		children: ["data", "data-messages", "data-logs", "app", "components", "lib", "actions", "contexts", "types", "scripts", "public"],
	},
	data: { name: "data/", children: ["data-users", "data-messages-file", "data-logs-file"] },
	"data-users": { name: "users.json" },
	"data-messages-file": { name: "messages/ {email}.json" },
	"data-logs-file": { name: "logs/ activity.json" },
	"data-messages": { name: "messages/" },
	"data-logs": { name: "logs/" },
	app: { name: "app/", children: ["app-login", "app-register", "app-dashboard", "app-api"] },
	"app-login": { name: "(auth)/login/" },
	"app-register": { name: "(auth)/register/" },
	"app-dashboard": { name: "dashboard/" },
	"app-api": { name: "api/" },
	components: { name: "components/", children: ["components-ui", "components-reui", "components-custom"] },
	"components-ui": { name: "ui/ — shadcn components" },
	"components-reui": { name: "reui/ — tree, button" },
	"components-custom": { name: "logo, sidebar, project-info…" },
	lib: { name: "lib/", children: ["lib-users", "lib-messages", "lib-logs", "lib-utils"] },
	"lib-users": { name: "users.ts" },
	"lib-messages": { name: "messages.ts" },
	"lib-logs": { name: "logs.ts" },
	"lib-utils": { name: "utils.ts" },
	actions: { name: "actions/", children: ["actions-messages", "actions-logs"] },
	"actions-messages": { name: "messages.ts" },
	"actions-logs": { name: "logs.ts" },
	contexts: { name: "contexts/", children: ["contexts-user"] },
	"contexts-user": { name: "user-context.tsx" },
	types: { name: "types/", children: ["types-index"] },
	"types-index": { name: "index.ts" },
	scripts: { name: "scripts/", children: ["scripts-seed"] },
	"scripts-seed": { name: "seed.ts" },
	public: { name: "public/" },
};

const stack = [
	{ name: "Next.js 16", role: "Framework" },
	{ name: "React 19", role: "UI Library" },
	{ name: "TypeScript", role: "Language" },
	{ name: "Tailwind CSS", role: "Styling" },
	{ name: "shadcn/ui", role: "Components" },
	{ name: "Base UI", role: "Primitives" },
	{ name: "Zod", role: "Validation" },
	{ name: "Sonner", role: "Notifications" },
];

const features = [
	"File-based storage (no database)",
	"Multi-user email simulation",
	"Inbox, outbox, drafts, and trash folders",
	"Compose and send emails between users",
	"Activity logging for all actions",
	"Auto-seeded demo data on build",
	"Responsive sidebar navigation",
	"Alert dialogs for destructive actions",
];

const indent = 20;

export function ProjectInfo() {
	const tree = useTree<Item>({
		initialState: {
			expandedItems: ["root", "data", "app", "components", "lib"],
		},
		indent,
		rootItemId: "root",
		getItemName: (item) => item.getItemData().name,
		isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
		dataLoader: {
			getItem: (itemId) => items[itemId],
			getChildren: (itemId) => items[itemId].children ?? [],
		},
		features: [syncDataLoaderFeature, hotkeysCoreFeature],
	});

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<LogoIcon className="size-10" />
					<h1 className="text-2xl font-bold tracking-tight">SimMail</h1>
					<Badge variant="secondary">v1.0</Badge>
				</div>
				<p className="text-muted-foreground text-sm">
					A lightweight, file-based email simulator built with Next.js.
					Send, receive, and manage emails between simulated users.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">How It Works</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm text-muted-foreground">
						<p>
							<strong>Compose</strong> — Write an email and hit send.
						</p>
						<p>
							<strong>Deliver</strong> — Message is written to both the sender&apos;s
							outbox and the recipient&apos;s inbox.
						</p>
						<p>
							<strong>Track</strong> — Every action is logged to the activity feed.
						</p>
						<p>
							<strong>Browse</strong> — View messages by folder: inbox, outbox,
							drafts, trash.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Tech Stack</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{stack.map((item) => (
								<Badge key={item.name} variant="outline" className="gap-1">
									{item.name}
									<span className="text-muted-foreground font-normal text-[10px]">
										{item.role}
									</span>
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-sm font-medium">Features</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
						{features.map((f) => (
							<li key={f} className="flex items-start gap-2">
								<span className="text-primary mt-1.5 size-1.5 rounded-full bg-current" />
								{f}
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-sm font-medium">Project Structure</CardTitle>
				</CardHeader>
				<CardContent>
					<Tree
						className="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
						indent={indent}
						tree={tree}
					>
						{tree.getItems().map((item) => (
							<TreeItem key={item.getId()} item={item}>
								<TreeItemLabel className="before:bg-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10">
									<span className="flex items-center gap-2">
										{item.isFolder() ? (
											item.isExpanded() ? (
												<FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
											) : (
												<FolderIcon className="text-muted-foreground pointer-events-none size-4" />
											)
										) : (
											<FileIcon className="text-muted-foreground pointer-events-none size-4" />
										)}
										{item.getItemName()}
									</span>
								</TreeItemLabel>
							</TreeItem>
						))}
					</Tree>
				</CardContent>
			</Card>
		</div>
	);
}
