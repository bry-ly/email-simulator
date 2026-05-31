import { NextResponse } from "next/server";
import { getUsers, createUser } from "@/lib/users";

export async function GET() {
	return NextResponse.json(await getUsers());
}

export async function POST(request: Request) {
	try {
		const { name, email } = await request.json();
		if (!name || !email) {
			return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
		}
		const user = await createUser(name, email);
		return NextResponse.json(user, { status: 201 });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to create user";
		return NextResponse.json({ error: message }, { status: 409 });
	}
}
