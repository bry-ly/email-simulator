import { NextRequest, NextResponse } from "next/server";
import { getLogs, getLogsByUser } from "@/lib/logs";

export async function GET(request: NextRequest) {
	const userId = request.nextUrl.searchParams.get("userId");

	if (userId) {
		return NextResponse.json(getLogsByUser(userId));
	}

	return NextResponse.json(
		getLogs().sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		)
	);
}
