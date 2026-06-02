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
import { UserAdd01Icon } from "@hugeicons/core-free-icons";

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = (formData.get("name") as string).trim();
		const email = (formData.get("email") as string).trim().toLowerCase();
		const password = formData.get("password") as string;
		const confirm = formData.get("confirm") as string;

		if (!name || !email || !password) {
			toast.error("Please fill in all fields");
			return;
		}

		if (password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}

		if (password !== confirm) {
			toast.error("Passwords do not match");
			return;
		}

		setLoading(true);
		const { error } = await authClient.signUp.email({
			name,
			email,
			password,
		});
		setLoading(false);

		if (error) {
			toast.error(error.message || "Failed to create account");
			return;
		}

		toast.success(`Welcome, ${name}!`);
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
					<CardTitle className="text-2xl">Create account</CardTitle>
					<CardDescription>
						Sign up for SimMail — Email Simulator
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								name="name"
								placeholder="Alice Johnson"
								required
								autoComplete="name"
							/>
						</div>
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
								placeholder="At least 8 characters"
								required
								minLength={8}
								autoComplete="new-password"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="confirm">Confirm password</Label>
							<Input
								id="confirm"
								name="confirm"
								type="password"
								placeholder="Repeat password"
								required
								minLength={8}
								autoComplete="new-password"
							/>
						</div>
						<Button type="submit" className="w-full" disabled={loading}>
							<HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} />
							{loading ? "Creating account..." : "Create account"}
						</Button>
					</form>
				</CardContent>
				<div className="px-6 pb-6 text-center text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link
						href="/login"
						className="underline underline-offset-4 hover:text-foreground"
					>
						Sign in
					</Link>
				</div>
			</Card>
		</div>
	);
}
