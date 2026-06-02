"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoIcon } from "@/components/logo";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Login01Icon } from "@hugeicons/core-free-icons";

export default function LoginPage() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = (formData.get("email") as string).trim().toLowerCase();
		const password = formData.get("password") as string;

		if (!email || !password) {
			toast.error("Please fill in all fields");
			return;
		}

		setLoading(true);
		const { error } = await authClient.signIn.email({
			email,
			password,
		});
		setLoading(false);

		if (error) {
			toast.error(error.message || "Invalid email or password");
			return;
		}

		toast.success("Welcome back!");
		router.push("/dashboard");
		router.refresh();
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md shadow-none dark:ring-0">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl text-primary-foreground">
						<LogoIcon className="size-6" />
					</div>
					<CardTitle className="text-2xl">SimMail</CardTitle>
					<CardDescription>
						Email Simulator — Sign in to continue
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="alice@sim.mail"
								required
								autoComplete="email"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="••••••••"
								required
								minLength={8}
								autoComplete="current-password"
							/>
						</div>
						<Button type="submit" className="w-full" disabled={loading}>
							<HugeiconsIcon icon={Login01Icon} strokeWidth={2} />
							{loading ? "Signing in..." : "Sign in"}
						</Button>
					</form>
				</CardContent>
				<div className="px-6 pb-6 text-center text-sm text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link
						href="/register"
						className="underline underline-offset-4 hover:text-foreground"
					>
						Create one
					</Link>
				</div>
			</Card>
		</div>
	);
}
