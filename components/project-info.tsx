"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogoIcon } from "@/components/logo";


const stack = [
	{ name: "Next.js 16", role: "Framework" },
	{ name: "React 19", role: "UI Library" },
	{ name: "TypeScript", role: "Language" },
	{ name: "Tailwind CSS", role: "Styling" },
	{ name: "shadcn/ui", role: "Components" },
	{ name: "Base UI", role: "Primitives" },
	{ name: "Neon Postgres", role: "Database" },
	{ name: "Drizzle ORM", role: "Data Layer" },
	{ name: "Sonner", role: "Notifications" },
];

const features = [
	"Neon Postgres + Drizzle ORM storage",
	"Multi-user email simulation",
	"Inbox, outbox, drafts, and trash folders",
	"Compose and send emails between users",
	"Activity logging for all actions",
	"Seeded demo data on build",
	"Responsive sidebar navigation",
	"Alert dialogs for destructive actions",
];

export function ProjectInfo() {
	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<LogoIcon className="size-10" />
					<h1 className="text-2xl font-bold tracking-tight">SimMail</h1>
					<Badge variant="secondary">v1.0</Badge>
				</div>
				<p className="text-muted-foreground text-sm">
					A lightweight email simulator built with Next.js, Neon Postgres, and Drizzle ORM.
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

		</div>
	);
}
