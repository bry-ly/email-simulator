"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteAccountAction } from "@/actions/account.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DangerZone() {
	const router = useRouter();
	const [confirm, setConfirm] = useState("");
	const [deleting, setDeleting] = useState(false);

	async function handleDelete() {
		setDeleting(true);
		try {
			const res = await deleteAccountAction();
			if ("error" in res) toast.error(res.error);
			else {
				toast.success("Account deleted");
				router.push("/login");
			}
		} catch {
			toast.error("Failed to delete account");
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className="rounded-lg border border-destructive/40 p-4">
			<h3 className="font-medium text-destructive text-sm">Danger zone</h3>
			<p className="mt-1 text-muted-foreground text-xs">
				Permanently delete your account, messages, labels, and logs. This cannot be undone.
			</p>
			<AlertDialog>
				<AlertDialogTrigger
					render={<Button variant="destructive" size="sm" className="mt-3" />}
				>
					Delete account
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete account?</AlertDialogTitle>
						<AlertDialogDescription>
							This permanently removes your account and all associated data. Type{" "}
							<span className="font-mono">DELETE</span> below to confirm.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="space-y-2">
						<Label htmlFor="delete-confirm">Confirmation</Label>
						<Input
							id="delete-confirm"
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							placeholder="Type DELETE"
						/>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							disabled={confirm !== "DELETE" || deleting}
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{deleting ? "Deleting..." : "Delete forever"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
