"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

export function RouteTransition({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	return (
		<ViewTransition key={pathname} default="none" enter="route-fade">
			{children}
		</ViewTransition>
	);
}
