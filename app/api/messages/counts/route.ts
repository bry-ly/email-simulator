import { NextRequest, NextResponse } from "next/server";
import { getFolderCounts } from "@/lib/messages";

export async function GET(request: NextRequest) {
	const email = request.nextUrl.searchParams.get("email");

	if (!email) {
		return NextResponse.json({ error: "email is required" }, { status: 400 });
	}

	return NextResponse.json(getFolderCounts(email));
}
