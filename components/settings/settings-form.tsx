"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LogoIcon } from "@/components/logo";
import { toast } from "sonner";
import { changeNameAction, changePasswordAction } from "@/actions/settings.actions";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	BellIcon,
	BrushIcon,
	Clock01Icon,
	ComputerIcon,
	InformationCircleIcon,
	Key01Icon,
	UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { AvatarPicker } from "@/components/settings/avatar-picker";
import { SessionsList } from "@/components/settings/sessions-list";
import { DangerZone } from "@/components/settings/danger-zone";
import { ActivityLog } from "@/components/logs/activity-log";
import { useNotificationPreference } from "@/hooks/use-notification-preference";
import { cn } from "@/lib/utils";

interface SettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

type Tab = "profile" | "account" | "appearance" | "notifications" | "sessions" | "logs" | "about";

const TABS: { id: Tab; label: string; icon: typeof UserCircleIcon }[] = [
	{ id: "profile", label: "Profile", icon: UserCircleIcon },
	{ id: "account", label: "Account", icon: Key01Icon },
	{ id: "appearance", label: "Appearance", icon: BrushIcon },
	{ id: "notifications", label: "Notifications", icon: BellIcon },
	{ id: "sessions", label: "Sessions", icon: ComputerIcon },
	{ id: "logs", label: "Logs", icon: Clock01Icon },
	{ id: "about", label: "About", icon: InformationCircleIcon },
];

const STACK = [
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

const FEATURES = [
	"Neon Postgres + Drizzle ORM storage",
	"Multi-user email simulation",
	"Inbox, outbox, drafts, and trash folders",
	"Compose and send emails between users",
	"Activity logging for all actions",
	"Seeded demo data on build",
	"Responsive sidebar navigation",
	"Alert dialogs for destructive actions",
];

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
	const { currentUser, refreshUser } = useUser();
	const [tab, setTab] = useState<Tab>("profile");
	const [name, setName] = useState(currentUser?.name ?? "");
	const [savingName, setSavingName] = useState(false);
	const [currentPw, setCurrentPw] = useState("");
	const [newPw, setNewPw] = useState("");
	const [savingPw, setSavingPw] = useState(false);

	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const { enabled: notifEnabled, toggle: toggleNotif } = useNotificationPreference();

	useEffect(() => {
		if (open) {
			setTab("profile");
			setName(currentUser?.name ?? "");
			setCurrentPw("");
			setNewPw("");
		}
	}, [open, currentUser?.name]);

	async function handleSaveName(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		setSavingName(true);
		try {
			const res = await changeNameAction(name);
			if ("error" in res) toast.error(res.error);
			else {
				toast.success("Name updated");
				await refreshUser();
			}
		} catch {
			toast.error("Failed to update name");
		} finally {
			setSavingName(false);
		}
	}

	async function handleChangePw(e: React.FormEvent) {
		e.preventDefault();
		if (newPw.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		setSavingPw(true);
		try {
			const res = await changePasswordAction(currentPw, newPw);
			if ("error" in res) toast.error(res.error);
			else {
				toast.success("Password changed");
				setCurrentPw("");
				setNewPw("");
			}
		} catch {
			toast.error("Failed to change password");
		} finally {
			setSavingPw(false);
		}
	}

	if (!currentUser) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className="flex max-h-[95vh] w-[min(96vw,1152px)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:min-h-[80vh]"
			>
				<DialogHeader className="border-b px-6 py-4">
					<DialogTitle className="text-xl">Settings</DialogTitle>
					<DialogDescription>
						Manage your account settings and set e-mail preferences.
					</DialogDescription>
				</DialogHeader>

				<div className="grid min-h-0 flex-1 grid-cols-[200px_1fr]">
					<nav className="flex flex-col gap-1 overflow-y-auto border-r bg-muted/30 p-3">
						{TABS.map((t) => {
							const active = tab === t.id;
							return (
								<button
									key={t.id}
									type="button"
									onClick={() => setTab(t.id)}
									className={cn(
										"flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
										active
											? "bg-foreground/10 font-medium text-foreground"
											: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
									)}
								>
									<HugeiconsIcon icon={t.icon} strokeWidth={2} className="size-4" />
									{t.label}
								</button>
							);
						})}
					</nav>

					<div className="overflow-y-auto p-6">
						{tab === "profile" && (
							<section className="space-y-6">
								<header>
									<h2 className="font-semibold text-lg">Profile</h2>
									<p className="text-muted-foreground text-sm">
										This is how others will see you on the site.
									</p>
								</header>
								<Separator />
								<form onSubmit={handleSaveName} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="settings-name">Display name</Label>
										<Input
											id="settings-name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											required
										/>
										<p className="text-muted-foreground text-xs">
											This is your public display name. You can change it at any time.
										</p>
									</div>
									<div className="space-y-2">
										<Label htmlFor="settings-email">Email</Label>
										<Input
											id="settings-email"
											value={currentUser.email}
											disabled
										/>
										<p className="text-muted-foreground text-xs">
											Email addresses are managed by your account provider.
										</p>
									</div>
									<Button type="submit" disabled={savingName} size="sm">
										{savingName ? "Saving..." : "Save name"}
									</Button>
								</form>
								<Separator />
								<AvatarPicker />
							</section>
						)}

						{tab === "account" && (
							<section className="space-y-6">
								<header>
									<h2 className="font-semibold text-lg">Account</h2>
									<p className="text-muted-foreground text-sm">
										Update your password to keep your account secure.
									</p>
								</header>
								<Separator />
								<form onSubmit={handleChangePw} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="settings-current-pw">Current password</Label>
										<Input
											id="settings-current-pw"
											type="password"
											value={currentPw}
											onChange={(e) => setCurrentPw(e.target.value)}
											required
											autoComplete="current-password"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="settings-new-pw">New password</Label>
										<Input
											id="settings-new-pw"
											type="password"
											value={newPw}
											onChange={(e) => setNewPw(e.target.value)}
											required
											minLength={8}
											autoComplete="new-password"
										/>
										<p className="text-muted-foreground text-xs">
											Must be at least 8 characters long.
										</p>
									</div>
									<Button type="submit" disabled={savingPw} size="sm">
										{savingPw ? "Updating..." : "Update password"}
									</Button>
								</form>
								<Separator />
								<DangerZone />
							</section>
						)}

						{tab === "appearance" && (
							<section className="space-y-6">
								<header>
									<h2 className="font-semibold text-lg">Appearance</h2>
									<p className="text-muted-foreground text-sm">
										Customize how SimMail looks on this device.
									</p>
								</header>
								<Separator />
								<div className="space-y-2">
									<Label>Theme</Label>
									<div className="grid grid-cols-3 gap-2">
										{(["light", "dark", "system"] as const).map((opt) => {
											const active = mounted && (theme === opt || (!theme && opt === "system"));
											return (
												<button
													key={opt}
													type="button"
													onClick={() => setTheme(opt)}
													className={cn(
														"rounded-md border px-3 py-2 text-sm capitalize transition-colors",
														active
															? "border-foreground/30 bg-foreground/5 font-medium"
															: "border-border hover:bg-foreground/5"
													)}
												>
													{opt}
												</button>
											);
										})}
									</div>
									{mounted && (
										<p className="text-muted-foreground text-xs">
											Active: {resolvedTheme ?? "system"}
										</p>
									)}
								</div>
							</section>
						)}

						{tab === "notifications" && (
							<section className="space-y-6">
								<header>
									<h2 className="font-semibold text-lg">Notifications</h2>
									<p className="text-muted-foreground text-sm">
										Decide what you want to be notified about.
									</p>
								</header>
								<Separator />
								<div className="flex items-start justify-between gap-4 rounded-lg border p-4">
									<div className="space-y-1">
										<p className="font-medium text-sm">New mail alerts</p>
										<p className="text-muted-foreground text-xs">
											Show a toast when a new message arrives in your inbox.
										</p>
									</div>
									<button
										type="button"
										role="switch"
										aria-checked={notifEnabled}
										onClick={() => toggleNotif(!notifEnabled)}
										className={cn(
											"relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors",
											notifEnabled ? "bg-foreground" : "bg-foreground/20"
										)}
									>
										<span
											className={cn(
												"absolute top-0.5 size-4 rounded-full bg-background shadow transition-transform",
												notifEnabled ? "translate-x-4.5" : "translate-x-0.5"
											)}
										/>
									</button>
								</div>
							</section>
						)}

						{tab === "sessions" && (
							<section className="space-y-6">
								<header>
									<h2 className="font-semibold text-lg">Active sessions</h2>
									<p className="text-muted-foreground text-sm">
										Devices that are currently signed in to your account.
									</p>
								</header>
								<Separator />
								<SessionsList />
							</section>
						)}

						{tab === "logs" && (
							<section className="space-y-6">
								<header>
									<h2 className="font-semibold text-lg">Activity logs</h2>
									<p className="text-muted-foreground text-sm">
										Recent activity for your account, including sends, reads, and
										deletes.
									</p>
								</header>
								<Separator />
								<ActivityLog userId={currentUser.email} />
							</section>
						)}

						{tab === "about" && (
							<section className="space-y-6">
								<header>
									<div className="flex items-center gap-3">
										<LogoIcon className="size-10" />
										<h2 className="font-semibold text-lg">SimMail</h2>
										<Badge variant="secondary">v1.0</Badge>
									</div>
									<p className="text-muted-foreground text-sm">
										A lightweight email simulator built with Next.js, Neon
										Postgres, and Drizzle ORM. Send, receive, and manage emails
										between simulated users.
									</p>
								</header>
								<Separator />
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="rounded-lg border p-4">
										<h3 className="mb-2 font-medium text-sm">How It Works</h3>
										<div className="space-y-1.5 text-muted-foreground text-sm">
											<p>
												<strong>Compose</strong> — Write an email and hit send.
											</p>
											<p>
												<strong>Deliver</strong> — Message is written to both the
												sender&apos;s outbox and the recipient&apos;s inbox.
											</p>
											<p>
												<strong>Track</strong> — Every action is logged to the
												activity feed.
											</p>
											<p>
												<strong>Browse</strong> — View messages by folder:
												inbox, outbox, drafts, trash.
											</p>
										</div>
									</div>
									<div className="rounded-lg border p-4">
										<h3 className="mb-2 font-medium text-sm">Tech Stack</h3>
										<div className="flex flex-wrap gap-2">
											{STACK.map((item) => (
												<Badge
													key={item.name}
													variant="outline"
													className="gap-1"
												>
													{item.name}
													<span className="text-muted-foreground font-normal text-[10px]">
														{item.role}
													</span>
												</Badge>
											))}
										</div>
									</div>
								</div>
								<div className="rounded-lg border p-4">
									<h3 className="mb-2 font-medium text-sm">Features</h3>
									<ul className="grid gap-1.5 text-muted-foreground text-sm sm:grid-cols-2">
										{FEATURES.map((f) => (
											<li key={f} className="flex items-start gap-2">
												<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-current text-primary" />
												{f}
											</li>
										))}
									</ul>
								</div>
							</section>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
