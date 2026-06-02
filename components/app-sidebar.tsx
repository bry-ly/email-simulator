"use client";

import { LogoIcon } from "@/components/logo";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/components/nav-group";
import { useNavGroups } from "@/components/app-shared";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { useSettingsDialog } from "@/contexts/settings-context";
import { useComposeDialog } from "@/contexts/compose-context";
import Link from "next/link";

export function AppSidebar() {
	const groups = useNavGroups();
	const settings = useSettingsDialog();
	const compose = useComposeDialog();

	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader className="h-14 justify-center">
				<SidebarMenuButton render={<Link href="/dashboard/inbox" />}>
					<LogoIcon />
					<span className="font-medium">SimMail</span>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="min-w-8 cursor-pointer bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
							tooltip="Compose"
							onClick={() => compose.open()}
						>
							<HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} />
							<span>Compose</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarGroup>
				{groups.map((group, index) => (
					<NavGroup key={`sidebar-group-${index}`} {...group} />
				))}
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu className="mt-2">
					<SidebarMenuItem>
						<SidebarMenuButton
							className="cursor-pointer text-muted-foreground"
							size="sm"
							tooltip="Settings"
							onClick={settings.open}
						>
							<HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />
							<span>Settings</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
