# Jira Clone

A full-stack project management application replicating core Jira functionality. Supports workspaces, projects, task boards, and member roles with a clean, responsive UI.

🔗 **[Live Demo](https://jira-clone-seven-pi.vercel.app)**

---

## Features

- **Workspaces** — create and manage multiple workspaces, each with their own projects and members
- **Projects** — projects within a workspace with customizable settings
- **Tasks** — create, assign, and track tasks with status, priority, due dates, and assignees
- **Kanban & List views** — switch between board and list views per project
- **Member roles** — workspace-level role management
- **Authentication** — sign up, sign in, invite-based onboarding

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| API | Hono |
| Backend-as-a-Service | Appwrite |
| UI | shadcn/ui, Tailwind CSS |
| Language | TypeScript |

---

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Fill in your Appwrite project credentials

# Start the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
