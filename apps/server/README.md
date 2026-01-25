# Workify Server

Backend API for Workify - a job board and professional networking platform.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) with TypeScript
- **Database**: MongoDB with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT + Google OAuth
- **Documentation**: Swagger/OpenAPI
- **Logging**: nestjs-pino with structured JSON logs
- **Rate Limiting**: @nestjs/throttler

## Features

- **Authentication** - Email OTP and Google OAuth login
- **User Profiles** - Candidate and Recruiter profile management
- **Jobs** - Job posting, search with filters, and application system
- **Posts** - Social feed with likes, comments, and cursor pagination
- **Connections** - Professional networking with connection requests
- **Companies** - Company profiles linked to recruiters

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MongoDB database

### Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Required environment variables:

| Variable          | Description                               |
| ----------------- | ----------------------------------------- |
| `JWT_SECRET`      | Secret key for JWT signing (min 32 chars) |
| `DATABASE_URL`    | MongoDB connection string                 |
| `CORS_URLS`       | Allowed origins (comma-separated)         |
| `ENABLE_TEST_OTP` | Set to `true` to enable test OTP bypass   |

### Installation

```bash
pnpm install
```

### Running the Server

```bash
# Development (watch mode)
pnpm run start:dev

# Production
pnpm run start:prod

# Build only
pnpm run build
```

The server runs on `http://localhost:3001` by default.

### API Documentation

Swagger docs available at: `http://localhost:3001/docs`

## Project Structure

```
src/
├── auth/           # Authentication (JWT, Google OAuth, OTP)
├── user/           # User profile management
├── post/           # Social posts, comments, likes
├── job/            # Job listings and applications
├── company/        # Company profiles
├── connection/     # Professional connections
├── common/         # Guards, filters, middleware, config
├── prisma/         # Database service
└── mail/           # Email service
```

## API Endpoints

| Module      | Endpoints                                                                          |
| ----------- | ---------------------------------------------------------------------------------- |
| Auth        | `POST /api/auth/otp/send`, `POST /api/auth/otp/verify`, `POST /api/auth/google`    |
| Users       | `GET /api/users/me`, `PATCH /api/users/candidate`, `PATCH /api/users/recruiter`    |
| Posts       | `GET/POST /api/posts`, `POST /api/posts/:id/like`, `POST /api/posts/:id/comments`  |
| Jobs        | `GET/POST /api/jobs`, `POST /api/jobs/:id/apply`, `GET /api/jobs/:id/applications` |
| Companies   | `GET/POST /api/companies`                                                          |
| Connections | `POST /api/connections`, `PATCH /api/connections/:id`                              |

## Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Coverage report
pnpm run test:cov
```

## Security Features

- **Rate Limiting**: Tiered limits (3/sec, 20/10sec, 100/min)
- **Input Validation**: class-validator with global ValidationPipe
- **Request Correlation**: X-Request-ID header for log tracing
- **Sensitive Data Redaction**: Passwords, tokens, OTPs redacted from logs

## License

MIT
