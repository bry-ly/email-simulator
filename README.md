# Email Simulator

A lightweight, file-based email simulator built with Next.js. Send, receive, and manage emails between simulated users — no database required.

## How It Works

Email Simulator stores everything as JSON files on disk. Each user gets their own mailbox file, and a shared activity log tracks all actions across the system.

```
data/
├── users.json                  # All registered users
├── messages/
│   ├── alice@sim.mail.json     # Alice's mailbox
│   ├── bob@sim.mail.json       # Bob's mailbox
│   └── ...
└── logs/
    └── activity.json           # Global activity log
```

### Data Flow

1. **Compose** — You write an email and hit send
2. **Deliver** — The message is written to both the sender's outbox and the recipient's inbox
3. **Track** — Every action (send, receive, read, delete) is logged to the activity feed
4. **Browse** — View messages by folder: inbox, outbox, drafts, trash

### Architecture

| Layer | What it does |
| --- | --- |
| `app/` | Next.js App Router — pages and API routes |
| `components/` | UI components (shadcn/ui + Base UI) |
| `lib/` | Core logic — users, messages, logs, storage |
| `actions/` | Server actions for mutations |
| `contexts/` | React context for auth state |
| `types/` | TypeScript type definitions |

### Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack)
- **UI** — shadcn/ui, Base UI, Tailwind CSS
- **Forms** — React Hook Form + Zod validation
- **State** — Server Actions + React Context
- **Storage** — JSON files (no database)
- **Language** — TypeScript

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with any seed user (Alice, Bob, Charlie, or Diana).

## Production Build

```bash
pnpm build
```

The `postbuild` script automatically seeds fresh data so the app is ready to use on first run.

## Contributing

Contributions are welcome. Open an issue or submit a pull request.
