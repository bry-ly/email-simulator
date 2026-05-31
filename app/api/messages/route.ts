import { NextRequest, NextResponse } from "next/server";
import { getMessagesByFolder } from "@/lib/messages";

export async function GET(request: NextRequest) {
	const email = request.nextUrl.searchParams.get("email");
	const folder = request.nextUrl.searchParams.get("folder");

	if (!email || !folder) {
		return NextResponse.json(
			{ error: "email and folder are required" },
			{ status: 400 }
		);
	}

	return NextResponse.json(
		await getMessagesByFolder(email, folder as "inbox" | "outbox" | "drafts" | "trash")
	);
}
