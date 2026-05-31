# Email Simulator

A lightweight email simulator built with Next.js and Neon Postgres. Send, receive, and manage emails between simulated users.

## How It Works

Email Simulator uses a Neon Postgres database with Drizzle ORM. Each user gets their own mailbox, and a shared activity log tracks all actions across the system.

### Data Flow

1. **Compose** — You write an email and hit send
2. **Deliver** — The message is stored in both the sender's outbox and the recipient's inbox
3. **Track** — Every action (send, receive, read, delete) is logged to the activity feed
4. **Browse** — View messages by folder: inbox, outbox, drafts, trash

### Architecture

| Layer | What it does |
| --- | --- |
| `app/` | Next.js App Router — pages and API routes |
| `components/` | UI components (shadcn/ui + Base UI) |
| `lib/` | Core logic — users, messages, logs |
| `lib/db/` | Drizzle schema and Neon connection |
| `actions/` | Server actions for mutations |
| `contexts/` | React context for auth state |
| `types/` | TypeScript type definitions |

### Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack)
- **UI** — shadcn/ui, Base UI, Tailwind CSS
- **Forms** — React Hook Form + Zod validation
- **State** — Server Actions + React Context
- **Database** — Neon Postgres + Drizzle ORM
- **Language** — TypeScript

## Getting Started

### Prerequisites

- [Neon](https://neon.tech) account (free tier works)
- Node.js 18+

### Setup

1. Clone the repo and install dependencies:

```bash
pnpm install
```

2. Create a `.env.local` file with your Neon connection string:

```
DATABASE_URL="postgresql://username:password@ep-your-region.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

3. Push the schema to your database:

```bash
pnpm db:push
```

4. Seed the database with sample data:

```bash
pnpm db:seed
```

5. Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with any seed user (Alice, Bob, Charlie, or Diana).

## Database Commands

| Command | Description |
| --- | --- |
| `pnpm db:push` | Push schema changes to the database |
| `pnpm db:seed` | Seed the database with sample users, messages, and logs |
| `pnpm db:studio` | Open Drizzle Studio to browse data |

## Vercel Deployment

1. Create a Neon project and copy the connection string
2. In your Vercel project, add `DATABASE_URL` as an environment variable
3. Run `pnpm db:push` and `pnpm db:seed` locally to set up the schema and seed data
4. Deploy — the app connects to Neon at runtime (no filesystem writes needed)

## Contributing

Contributions are welcome. Open an issue or submit a pull request.
