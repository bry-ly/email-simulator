"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Avatar,
	AvatarFallback,
} from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Login01Icon } from "@hugeicons/core-free-icons";
import { LogoIcon } from "@/components/logo";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

function getInitials(name: string) {
	return name
		.split(" ")
		.map((w) => w.charAt(0).toUpperCase())
		.join("");
}

export default function LoginPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		fetch("/api/users")
			.then((res) => res.json())
			.then((data: User[]) => {
				setUsers(data);
				setLoading(false);
			});
	}, []);

	function selectUser(user: User) {
		localStorage.setItem("currentUserId", user.id);
		toast.success(`Welcome back, ${user.name}!`);
		router.push("/dashboard/inbox");
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md shadow-none dark:ring-0">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl  text-primary-foreground">
						<LogoIcon className="size-6" />
					</div>
					<CardTitle className="text-2xl">SimMail</CardTitle>
					<CardDescription>
					  Email Simulator — Select an account to continue
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
							Loading accounts...
						</div>
					) : (
						<div className="flex flex-col gap-2">
							{users.map((user) => (
								<button
									key={user.id}
									onClick={() => selectUser(user)}
									className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent"
								>
									<Avatar className="size-10">
										<AvatarFallback
											style={{
												backgroundColor: user.avatarColor,
												color: "white",
											}}
										>
											{getInitials(user.name)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<p className="font-medium text-foreground text-sm">
											{user.name}
										</p>
										<p className="text-muted-foreground text-xs">
											{user.email}
										</p>
									</div>
									<HugeiconsIcon
										icon={Login01Icon}
										strokeWidth={2}
										className="size-4 text-muted-foreground"
									/>
								</button>
							))}
						</div>
					)}
				</CardContent>
				<div className="px-6 pb-6 text-center text-sm text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link href="/register" className="underline underline-offset-4 hover:text-foreground">
						Create one
					</Link>
				</div>
			</Card>
		</div>
	);
}
