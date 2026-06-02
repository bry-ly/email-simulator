"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateAvatarColorAction } from "@/actions/account.actions";
import { useUser } from "@/contexts/user-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PALETTE = [
	"#6366f1", "#ec4899", "#10b981", "#f59e0b", "#06b6d4",
	"#8b5cf6", "#ef4444", "#22c55e", "#3b82f6", "#f97316",
];

export function AvatarPicker() {
	const { currentUser, refreshUser } = useUser();
	const [color, setColor] = useState(currentUser?.avatarColor ?? "#6366f1");
	const [saving, setSaving] = useState(false);

	async function save() {
		setSaving(true);
		try {
			const res = await updateAvatarColorAction(color);
			if ("error" in res) toast.error(res.error);
			else {
				toast.success("Avatar color updated");
				await refreshUser();
			}
		} catch {
			toast.error("Failed to update color");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="space-y-2">
			<label className="font-medium text-sm">Avatar color</label>
			<div className="flex flex-wrap gap-2">
				{PALETTE.map((c) => (
					<button
						key={c}
						type="button"
						aria-label={c}
						onClick={() => setColor(c)}
						className={cn(
							"size-8 cursor-pointer rounded-full border-2 transition-transform",
							color === c
								? "scale-110 border-foreground"
								: "border-transparent hover:scale-105"
						)}
						style={{ backgroundColor: c }}
					/>
				))}
			</div>
			<Button size="sm" onClick={save} disabled={saving || color === currentUser?.avatarColor}>
				{saving ? "Saving..." : "Save color"}
			</Button>
		</div>
	);
}
