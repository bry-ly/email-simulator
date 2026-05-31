"use server";

import { getUsers } from "@/lib/users";

export async function getUsersAction() {
	return await getUsers();
}
