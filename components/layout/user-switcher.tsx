"use client";

import { useUser } from "@/contexts/user-context";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon, Logout02Icon } from "@hugeicons/core-free-icons";

function getInitials(name: string) {
	return name
		.split(" ")
		.map((w) => w.charAt(0).toUpperCase())
		.join("");
}

export function UserSwitcher() {
	const { currentUser, users, setCurrentUser, logout } = useUser();

	if (!currentUser) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<button type="button" className="size-8 cursor-pointer rounded-full" />}>
				<Avatar className="size-8">
					<AvatarFallback style={{ backgroundColor: currentUser.avatarColor, color: "white" }}>
						{getInitials(currentUser.name)}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="flex items-center gap-3">
						<Avatar className="size-10">
							<AvatarFallback style={{ backgroundColor: currentUser.avatarColor, color: "white" }}>
								{getInitials(currentUser.name)}
							</AvatarFallback>
						</Avatar>
						<div>
							<span className="font-medium text-foreground">{currentUser.name}</span>
							<br />
							<div className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-muted-foreground text-xs">
								{currentUser.email}
							</div>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-muted-foreground text-xs">
						Switch Account
					</DropdownMenuLabel>
					{users.map((user) => (
						<DropdownMenuItem
							key={user.id}
							className="flex items-center gap-2"
							onClick={() => setCurrentUser(user)}
						>
							<Avatar className="size-6">
								<AvatarFallback style={{ backgroundColor: user.avatarColor, color: "white" }}>
									{getInitials(user.name)}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<p className="text-sm">{user.name}</p>
								<p className="text-muted-foreground text-xs">{user.email}</p>
							</div>
							{user.id === currentUser.id && (
								<HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4 text-primary" />
							)}
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="w-full cursor-pointer"
					variant="destructive"
					onClick={logout}
				>
					<HugeiconsIcon icon={Logout02Icon} strokeWidth={2} />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
