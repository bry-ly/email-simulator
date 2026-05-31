import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");

function writeJson(filename: string, data: unknown, subdir?: string) {
	const dir = subdir ? join(DATA_DIR, subdir) : DATA_DIR;
	writeFileSync(join(dir, filename), JSON.stringify(data, null, 2));
}

const users = [
	{ id: "alice", name: "Alice Johnson", email: "alice@sim.mail", avatarColor: "#6366f1" },
	{ id: "bob", name: "Bob Smith", email: "bob@sim.mail", avatarColor: "#f59e0b" },
	{ id: "charlie", name: "Charlie Lee", email: "charlie@sim.mail", avatarColor: "#10b981" },
	{ id: "diana", name: "Diana Park", email: "diana@sim.mail", avatarColor: "#ec4899" },
];

const now = new Date();
function daysAgo(d: number) {
	return new Date(now.getTime() - d * 86400000).toISOString();
}

const messages: Record<string, unknown[]> = {
	"alice@sim.mail": [
		{ id: "msg-1", from: "bob@sim.mail", to: "alice@sim.mail", subject: "Project Update", body: "Hey Alice, just wanted to let you know the project is on track. We should be ready for the demo next week.\n\nBest,\nBob", timestamp: daysAgo(1), read: false, folder: "inbox", labels: [] },
		{ id: "msg-2", from: "alice@sim.mail", to: "bob@sim.mail", subject: "Re: Project Update", body: "Thanks Bob! I'll prepare the slides for the demo. Let me know if you need anything else.", timestamp: daysAgo(1), read: true, folder: "outbox", labels: [] },
		{ id: "msg-3", from: "charlie@sim.mail", to: "alice@sim.mail", subject: "Meeting Tomorrow", body: "Hi Alice, are we still meeting tomorrow at 2pm? I have a few things to discuss.", timestamp: daysAgo(2), read: true, folder: "inbox", labels: [] },
		{ id: "msg-4", from: "alice@sim.mail", to: "charlie@sim.mail", subject: "Re: Meeting Tomorrow", body: "Yes, 2pm works for me. See you then!", timestamp: daysAgo(2), read: true, folder: "outbox", labels: [] },
	],
	"bob@sim.mail": [
		{ id: "msg-5", from: "alice@sim.mail", to: "bob@sim.mail", subject: "New Feature Request", body: "Hi Bob, can you add a dark mode toggle to the settings page? Users have been asking for it.", timestamp: daysAgo(3), read: true, folder: "inbox", labels: [] },
		{ id: "msg-6", from: "diana@sim.mail", to: "bob@sim.mail", subject: "Bug Report", body: "Hey Bob, I found a bug in the login flow. When I enter an invalid email, the form doesn't show an error. Can you look into it?", timestamp: daysAgo(0), read: false, folder: "inbox", labels: [] },
	],
	"charlie@sim.mail": [
		{ id: "msg-7", from: "alice@sim.mail", to: "charlie@sim.mail", subject: "Welcome!", body: "Welcome to the team Charlie! Let me know if you need help getting set up.", timestamp: daysAgo(5), read: true, folder: "inbox", labels: [] },
	],
	"diana@sim.mail": [
		{ id: "msg-8", from: "bob@sim.mail", to: "diana@sim.mail", subject: "Re: Bug Report", body: "Thanks for reporting this Diana! I'll fix it in the next sprint.", timestamp: daysAgo(0), read: true, folder: "outbox", labels: [] },
	],
};

const logs = [
	{ id: "log-1", action: "sent", messageId: "msg-2", userId: "alice@sim.mail", timestamp: daysAgo(1), details: "Sent to bob@sim.mail: Re: Project Update" },
	{ id: "log-2", action: "received", messageId: "msg-1", userId: "alice@sim.mail", timestamp: daysAgo(1), details: "Received from bob@sim.mail: Project Update" },
	{ id: "log-3", action: "sent", messageId: "msg-4", userId: "alice@sim.mail", timestamp: daysAgo(2), details: "Sent to charlie@sim.mail: Re: Meeting Tomorrow" },
	{ id: "log-4", action: "received", messageId: "msg-3", userId: "alice@sim.mail", timestamp: daysAgo(2), details: "Received from charlie@sim.mail: Meeting Tomorrow" },
	{ id: "log-5", action: "sent", messageId: "msg-5", userId: "alice@sim.mail", timestamp: daysAgo(3), details: "Sent to bob@sim.mail: New Feature Request" },
	{ id: "log-6", action: "received", messageId: "msg-6", userId: "bob@sim.mail", timestamp: daysAgo(0), details: "Received from diana@sim.mail: Bug Report" },
	{ id: "log-7", action: "sent", messageId: "msg-8", userId: "diana@sim.mail", timestamp: daysAgo(0), details: "Sent to bob@sim.mail: Re: Bug Report" },
	{ id: "log-8", action: "received", messageId: "msg-7", userId: "charlie@sim.mail", timestamp: daysAgo(5), details: "Received from alice@sim.mail: Welcome!" },
	{ id: "log-9", action: "read", messageId: "msg-1", userId: "alice@sim.mail", timestamp: daysAgo(0), details: "Read: Project Update" },
	{ id: "log-10", action: "read", messageId: "msg-3", userId: "alice@sim.mail", timestamp: daysAgo(1), details: "Read: Meeting Tomorrow" },
];

console.log("Seeding data...");
writeJson("users.json", users);
for (const [email, msgs] of Object.entries(messages)) {
	writeJson(`${email}.json`, msgs, "messages");
}
writeJson("activity.json", logs, "logs");
console.log("Done! Seeded 4 users, 8 messages, 10 logs.");
