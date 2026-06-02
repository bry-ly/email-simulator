import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg" }),
	user: {
		additionalFields: {
			avatarColor: {
				type: "string",
				required: false,
				defaultValue: "#6366f1",
				input: true,
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		autoSignIn: true,
	},
	rateLimit: { enabled: true, window: 60, max: 30 },
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
	},
	plugins: [nextCookies()],
});
