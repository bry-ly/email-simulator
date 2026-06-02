import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
} from "@/components/ui/card";

interface EmptyStateProps {
	icon: IconSvgElement;
	title: string;
	description: string;
	actionLabel?: string;
	actionHref?: string;
	onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
	return (
		<Card className="gap-0 shadow-none dark:ring-0">
			<CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
				<div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
					<HugeiconsIcon icon={icon} strokeWidth={2} className="size-6" />
				</div>
				<div className="space-y-1">
					<h3 className="font-semibold text-base">{title}</h3>
					<p className="max-w-sm text-muted-foreground text-sm">{description}</p>
				</div>
				{actionLabel && onAction && (
					<Button onClick={onAction} className="mt-2">
						{actionLabel}
					</Button>
				)}
				{actionLabel && !onAction && actionHref && (
					<Button nativeButton={false} render={<Link href={actionHref} />} className="mt-2">
						{actionLabel}
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
