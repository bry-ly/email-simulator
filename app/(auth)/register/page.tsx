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

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;

		if (!name || !email) {
			toast.error("Please fill in all fields");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email }),
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed to create account");
			}
			const user = await res.json();
			localStorage.setItem("currentUserId", user.id);
			toast.success(`Welcome, ${user.name}!`);
			router.push("/dashboard/inbox");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Registration failed");
		} finally {
			setLoading(false);
		}
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
							<Input id="name" name="name" placeholder="Alice Johnson" required />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" name="email" type="email" placeholder="alice@sim.mail" required />
						</div>
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Creating account..." : "Create account"}
						</Button>
					</form>
				</CardContent>
				<div className="px-6 pb-6 text-center text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link href="/login" className="underline underline-offset-4 hover:text-foreground">
						Sign in
					</Link>
				</div>
			</Card>
		</div>
	);
}
