import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { UserProvider } from "@/contexts/user-context";
import { ShortcutsProvider } from "@/components/layout/shortcuts-provider";
import { SettingsProvider } from "@/contexts/settings-context";
import { ComposeProvider } from "@/contexts/compose-context";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	const user = {
		id: session.user.id,
		name: session.user.name,
		email: session.user.email,
		avatarColor: (session.user as { avatarColor?: string }).avatarColor ?? "#6366f1",
	};

	return (
		<UserProvider initialUser={user}>
			<SettingsProvider>
				<ComposeProvider>
					<ShortcutsProvider>
						<AppShell>{children}</AppShell>
					</ShortcutsProvider>
				</ComposeProvider>
			</SettingsProvider>
		</UserProvider>
	);
}
