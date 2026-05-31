import { NextRequest, NextResponse } from "next/server";
import { getMessageById } from "@/lib/messages";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const email = request.nextUrl.searchParams.get("email");
	const { id } = await params;

	if (!email) {
		return NextResponse.json({ error: "email is required" }, { status: 400 });
	}

	const message = getMessageById(email, id);
	if (!message) {
		return NextResponse.json({ error: "Message not found" }, { status: 404 });
	}

	return NextResponse.json(message);
}
