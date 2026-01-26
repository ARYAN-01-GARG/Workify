---
description: Core project rules and coding standards for the Workify monorepo
---

# Workify Project Rules & Coding Standards

> [!IMPORTANT] > **Always apply these rules** when working on any part of the codebase. These are non-negotiable
> standards that ensure consistency, quality, and maintainability.

---

## 🏗️ Tech Stack & Architecture

| Layer            | Technology                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------ |
| **Frontend**     | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, `@repo/ui` (shadcn-derived) |
| **State & Data** | NextAuth (JWT sessions) + TanStack Query (fetch/cache)                                     |
| **HTTP Client**  | Axios via `ApiClient` abstraction                                                          |
| **Validation**   | Zod (frontend) + class-validator/class-transformer (backend DTOs)                          |
| **Backend**      | NestJS 11 (modules/services/controllers), Prisma ORM, JWT auth (Passport)                  |
| **API Docs**     | Swagger/OpenAPI auto-generated via `@nestjs/swagger`                                       |
| **Email**        | `@nestjs-modules/mailer` with HTML templates                                               |
| **Database**     | PostgreSQL via Prisma; shared enums/types in `@repo/db` and `@repo/shared-types`           |
| **Tooling**      | pnpm workspaces, Turbo, Prettier + Tailwind plugin, ESLint (flat configs)                  |

---

## 🎯 Current Features Being Built

### ✅ Implemented

- **Authentication** - Email/OTP, Password, Google OAuth
- **User Profiles** - Candidate & Recruiter profiles with education/experience
- **Connections** - Send/accept/reject connection requests
- **Jobs** - Full CRUD, job applications, filtering
- **Posts/Feed** - Create posts, likes, comments with nested replies
- **Companies** - Company profiles for recruiters

### 🚧 In Progress

- **Dashboard** - User dashboard with activity metrics
- **Home Page with Feeds** - Personalized feed with "Following" filter
- **Profile Views** - Track who viewed your profile

### 📋 Future Features

- **Real-time Chat** - LiveKit-based messaging between connections
- **Notifications** - Real-time notifications for connections, likes, comments, job applications
- **AI Features** - AI-powered job recommendations, resume analysis, interview prep
- **Advanced Search** - AI-enhanced search across jobs, people, companies

---

## 📋 Code Quality Standards

### General Requirements

- **Always write TypeScript** - No `any` types unless absolutely necessary
- **Follow ESLint and Prettier** - Fix all warnings where feasible
- **Conventional Commits** - Use commitlint config for commit messages
- **Defensive programming** - null/undefined guards, explicit return types
- **Small functions** - Single-purpose; prefer composition over inheritance
- **Centralize side-effects** - API, storage, navigation in services/hooks
- **Meaningful logs and errors** - Include context; never swallow errors silently

### Naming Conventions

| Element                    | Convention                                   | Example                          |
| -------------------------- | -------------------------------------------- | -------------------------------- |
| Variables, functions       | `camelCase`                                  | `getUserProfile`                 |
| Classes, Components, Types | `PascalCase`                                 | `UserProfile`, `EditProfileForm` |
| Constants                  | `UPPER_SNAKE_CASE`                           | `MAX_FILE_SIZE`                  |
| Enums                      | `PascalCase` with `UPPER_SNAKE_CASE` members | `RoleEnum.ADMIN`                 |
| React Components (files)   | `PascalCase.tsx`                             | `AppSidebar.tsx`                 |
| Other TS files             | `kebab-case.ts`                              | `auth.service.ts`                |
| DTOs                       | `kebab-case.dto.ts`                          | `login.dto.ts`                   |
| Tests                      | `*.spec.ts` / `*.spec.tsx`                   | `auth.service.spec.ts`           |

---

## 📁 Project Structure

### Backend (`apps/server/src`)

```
src/
├── auth/                 # Auth module: decorators, guards, strategies, DTOs
├── common/               # Shared: config, filters, utilities
├── prisma/               # Prisma module/service
├── user/                 # User module
├── post/                 # Posts/feed module
├── job/                  # Jobs module
├── connection/           # Connections module
├── company/              # Company module
└── mail/                 # Email templates and service
```

### Frontend (`apps/web`)

```
app/                      # Next.js App Router routes
components/               # Reusable components (PascalCase)
  ├── auth/               # Auth-related components
  ├── feed/               # Feed/post components
  ├── profile/            # Profile components
  ├── layout/             # Layout components
  └── general/            # Shared UI components
lib/                      # Core libraries
  ├── api-client.ts       # Axios wrapper
  ├── auth.ts             # NextAuth configuration
  └── providers.tsx       # Context providers
services/                 # HTTP service classes (static methods)
hooks/                    # Custom React hooks (TanStack Query)
queries/                  # TanStack Query hooks (organized by domain)
contexts/                 # React contexts (AuthContext)
utils/                    # Utility functions
config/                   # Environment config, routes
types/                    # TypeScript type definitions
```

---

## 🌐 API Documentation Access

> [!TIP] > **Always read the Swagger documentation before implementing web services!**

```bash
# Start the server
cd apps/server && pnpm dev

# Access Swagger docs at:
# http://localhost:3001/docs
```

The Swagger spec is also available at `apps/server/swagger-spec.json` for offline reference.

---

## ✅ QA Audit Checklist

> [!CAUTION] > **After completing each section, perform a QA audit using this checklist:**

### Code Quality

- [ ] No TypeScript `any` types (unless justified)
- [ ] All functions have explicit return types
- [ ] No unused imports or variables
- [ ] ESLint and Prettier pass without errors
- [ ] Error handling is comprehensive with meaningful messages

### Frontend Specific

- [ ] Loading states implemented for all async operations
- [ ] Error states with user-friendly messages
- [ ] Empty states for lists with no data
- [ ] Forms validated with Zod schemas
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Accessibility: keyboard navigation, ARIA labels
- [ ] API calls via services, not directly in components

### Backend Specific

- [ ] DTOs properly annotated with `@ApiProperty`
- [ ] Validation with `class-validator`
- [ ] Proper HTTP exceptions (`BadRequestException`, `NotFoundException`, etc.)
- [ ] Database queries optimized (no N+1, proper includes)
- [ ] Transactions used for multi-step operations

### Security

- [ ] Input validation on both frontend and backend
- [ ] Auth guards on protected routes
- [ ] No sensitive data logged
- [ ] CORS properly configured

---

## 🚀 Development Workflow

1. **Read Swagger docs** before implementing any API integration
2. **Create service methods** in `apps/web/services/`
3. **Create query hooks** in `apps/web/hooks/` using TanStack Query
4. **Implement components** using service methods (never call API directly)
5. **Test thoroughly** - loading, error, empty states
6. **Run QA audit** using the checklist above
7. **Request code review** before merging
