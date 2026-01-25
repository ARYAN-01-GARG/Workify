# Workify Monorepo

A full-stack job board and professional networking platform built with modern technologies.

## Overview

Workify enables job seekers to find opportunities and connect with recruiters, while providing companies with a platform
to post jobs and manage applications.

## Tech Stack

| Layer             | Technology                                 |
| ----------------- | ------------------------------------------ |
| **Frontend**      | Next.js 14, React, TypeScript, TailwindCSS |
| **Backend**       | NestJS, TypeScript, Prisma ORM             |
| **Database**      | MongoDB                                    |
| **Auth**          | NextAuth.js, JWT, Google OAuth             |
| **UI Components** | shadcn/ui, Radix UI                        |
| **Monorepo**      | Turborepo, pnpm workspaces                 |

## Project Structure

```
workify-monorepo/
├── apps/
│   ├── server/          # NestJS backend API
│   └── web/             # Next.js frontend
├── packages/
│   ├── db/              # Prisma schema and client
│   ├── shared-types/    # Shared TypeScript types
│   ├── ui/              # Shared UI components (shadcn/ui)
│   ├── eslint-config/   # ESLint configurations
│   └── typescript-config/ # TypeScript configurations
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- MongoDB database

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm --filter @repo/db db:generate
```

### Environment Setup

Create `.env` files in `apps/server` and `apps/web`:

```bash
# Server (.env)
cp apps/server/.env.example apps/server/.env

# Web (.env.local)
cp apps/web/.env.example apps/web/.env.local
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm --filter server dev
pnpm --filter web dev
```

### Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter server build
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter server test
pnpm --filter web test
```

### Linting

```bash
# Lint all packages
pnpm lint

# Fix lint issues
pnpm lint --fix
```

## Apps

### Server (`apps/server`)

NestJS backend API providing:

- Authentication (Email OTP, Google OAuth)
- User profile management (Candidates & Recruiters)
- Job posting and application system
- Social posts with likes and comments
- Professional connections
- Company profiles

**API Docs**: `http://localhost:3001/docs`

### Web (`apps/web`)

Next.js frontend with:

- Responsive UI with TailwindCSS
- Authentication via NextAuth.js
- Dashboard for candidates and recruiters
- Job search and filtering
- Social feed

## Packages

| Package                   | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `@repo/db`                | Prisma schema, migrations, and database client |
| `@repo/shared-types`      | TypeScript types shared between apps           |
| `@repo/ui`                | Reusable React components with shadcn/ui       |
| `@repo/eslint-config`     | Shared ESLint configurations                   |
| `@repo/typescript-config` | Shared TypeScript configurations               |

## Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Start all apps in development mode |
| `pnpm build`      | Build all apps and packages        |
| `pnpm lint`       | Lint all packages                  |
| `pnpm test`       | Run tests across all packages      |
| `pnpm format:fix` | Format code with Prettier          |

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm lint` and `pnpm build`
4. Submit a pull request

## License

MIT
