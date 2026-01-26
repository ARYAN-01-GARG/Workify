---
description: API reference and documentation guide for Workify backend
---

# API Reference Guide

> [!IMPORTANT] > **Always read the Swagger documentation before implementing any frontend service!** Access at:
> `http://localhost:3001/docs` when server is running.

---

## 🔗 API Base URL

- **Development:** `http://localhost:3001/api`
- **Production:** Set via `NEXT_PUBLIC_API_URL` environment variable

---

## 🔐 Authentication

All protected endpoints require a Bearer token in the `Authorization` header.

```http
Authorization: Bearer <jwt_token>
```

### Auth Endpoints

| Method | Endpoint           | Description                  | Auth Required |
| ------ | ------------------ | ---------------------------- | ------------- |
| `POST` | `/auth/send-otp`   | Send OTP to email            | ❌            |
| `POST` | `/auth/verify-otp` | Verify OTP and get token     | ❌            |
| `POST` | `/auth/register`   | Register with email/password | ❌            |
| `POST` | `/auth/login`      | Login with email/password    | ❌            |
| `POST` | `/auth/google`     | Login with Google ID token   | ❌            |

---

## 👤 User Endpoints

| Method  | Endpoint                  | Description              | Auth Required |
| ------- | ------------------------- | ------------------------ | ------------- |
| `GET`   | `/user/profile`           | Get current user profile | ✅            |
| `GET`   | `/user/:id`               | Get user by ID           | ✅            |
| `PATCH` | `/user/profile/candidate` | Update candidate profile | ✅            |
| `PATCH` | `/user/profile/recruiter` | Update recruiter profile | ✅            |

### Update Candidate Profile DTO

```typescript
interface UpdateCandidateProfileDto {
  name?: string;
  bio?: string;
  about?: string;
  skills?: string[];
  education?: EducationDto[];
  experience?: ExperienceDto[];
}

interface EducationDto {
  id?: string; // Include for updates, omit for new
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string; // ISO date
  endDate?: string;
  grade?: string;
  description?: string;
}

interface ExperienceDto {
  id?: string;
  title: string;
  employmentType: string;
  companyName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description?: string;
}
```

---

## 🤝 Connections Endpoints

| Method   | Endpoint               | Description                   | Auth Required |
| -------- | ---------------------- | ----------------------------- | ------------- |
| `POST`   | `/connections`         | Send connection request       | ✅            |
| `GET`    | `/connections`         | Get all accepted connections  | ✅            |
| `GET`    | `/connections/pending` | Get pending received requests | ✅            |
| `PATCH`  | `/connections/:id`     | Accept/reject connection      | ✅            |
| `DELETE` | `/connections/:id`     | Cancel pending request        | ✅            |

---

## 💼 Jobs Endpoints

| Method   | Endpoint                 | Description        | Auth Required  |
| -------- | ------------------------ | ------------------ | -------------- |
| `POST`   | `/jobs`                  | Create job posting | ✅ (Recruiter) |
| `GET`    | `/jobs`                  | List/search jobs   | ❌             |
| `GET`    | `/jobs/:id`              | Get job details    | ❌             |
| `PATCH`  | `/jobs/:id`              | Update job         | ✅ (Owner)     |
| `DELETE` | `/jobs/:id`              | Delete job         | ✅ (Owner)     |
| `POST`   | `/jobs/:id/apply`        | Apply for job      | ✅             |
| `GET`    | `/jobs/:id/applications` | Get applications   | ✅ (Owner)     |

### Job Query Parameters

```typescript
interface JobQueryDto {
  query?: string; // Search in title/description
  location?: string; // Filter by location
  type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  workMode?: 'REMOTE' | 'HYBRID' | 'ONSITE';
  experienceLevel?: 'ENTRY' | 'MID' | 'SENIOR' | 'DIRECTOR' | 'EXECUTIVE';
  page?: number; // Default: 1
  limit?: number; // Default: 20, Max: 100
}
```

---

## 📝 Posts Endpoints

| Method   | Endpoint              | Description     | Auth Required |
| -------- | --------------------- | --------------- | ------------- |
| `POST`   | `/posts`              | Create post     | ✅            |
| `GET`    | `/posts`              | Get feed        | ✅            |
| `GET`    | `/posts/:id`          | Get single post | ✅            |
| `PATCH`  | `/posts/:id`          | Update post     | ✅ (Owner)    |
| `DELETE` | `/posts/:id`          | Delete post     | ✅ (Owner)    |
| `POST`   | `/posts/:id/like`     | Toggle like     | ✅            |
| `POST`   | `/posts/:id/comments` | Add comment     | ✅            |
| `GET`    | `/posts/:id/comments` | Get comments    | ✅            |

### Posts Query Parameters

```typescript
interface PostQueryDto {
  query?: string; // Search in content
  tag?: string; // Filter by tag
  type?: 'ALL' | 'FOLLOWING'; // Feed type
  authorId?: string; // Filter by author
  page?: number; // Default: 1
  limit?: number; // Default: 10
  cursor?: string; // Cursor-based pagination
}
```

### Post Response Shape

```typescript
interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  isLiked: boolean; // Current user has liked
}
```

---

## 💬 Comments Endpoints

| Method   | Endpoint             | Description            | Auth Required |
| -------- | -------------------- | ---------------------- | ------------- |
| `POST`   | `/comments/:id/like` | Toggle like on comment | ✅            |
| `DELETE` | `/comments/:id`      | Delete comment         | ✅ (Owner)    |

---

## 🏢 Company Endpoints

| Method   | Endpoint         | Description         | Auth Required |
| -------- | ---------------- | ------------------- | ------------- |
| `POST`   | `/companies`     | Create company      | ✅            |
| `GET`    | `/companies`     | List companies      | ❌            |
| `GET`    | `/companies/:id` | Get company details | ❌            |
| `PATCH`  | `/companies/:id` | Update company      | ✅ (Owner)    |
| `DELETE` | `/companies/:id` | Delete company      | ✅ (Owner)    |

---

## 📄 Pagination Response Format

All paginated endpoints return this structure:

```typescript
interface PaginatedResponse<T> {
  items: T[]; // Array of items
  total: number; // Total count
  page: number; // Current page
  limit: number; // Items per page
  hasMore: boolean; // More pages available
  nextCursor?: string; // For cursor-based pagination
}
```

---

## ⚠️ Error Response Format

```typescript
interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Example
{
  "statusCode": 400,
  "message": ["email must be a valid email address"],
  "error": "Bad Request"
}
```

---

## 🔧 Using the ApiClient

The `ApiClient` in `apps/web/lib/api-client.ts` handles:

- Base URL configuration
- Token attachment from NextAuth session
- Error normalization
- Deep trimming of request data

```typescript
import { ApiClient } from '@/lib/api-client';

// GET request
const user = await ApiClient.get<User>('/user/profile');

// POST request
const post = await ApiClient.post<Post>('/posts', { content: 'Hello!' });

// PATCH request
await ApiClient.patch('/user/profile/candidate', { name: 'New Name' });

// DELETE request
await ApiClient.delete('/posts/123');

// With query params
const jobs = await ApiClient.get<PaginatedResponse<Job>>('/jobs', {
  params: { page: 1, limit: 20, type: 'FULL_TIME' },
});
```

---

## 📚 Swagger Spec File

For offline reference, the OpenAPI spec is at: `apps/server/swagger-spec.json`

You can import this into Postman or other API tools for testing.
