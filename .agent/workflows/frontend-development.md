---
description: Frontend development standards for Next.js web application
---

# Frontend Development Standards

> [!IMPORTANT] Follow these patterns exactly when building frontend features. Consistency is key.

---

## 📂 File Organization

### Service Layer Pattern

**Location:** `apps/web/services/`

Services are **static classes** that wrap API calls. Components should NEVER call APIs directly.

```typescript
// apps/web/services/job.service.ts
import { ApiClient } from '@/lib/api-client';
import type { Job, CreateJobDto, UpdateJobDto, PaginatedResponse } from '@/types';

export class JobService {
  static async getAll(params?: {
    page?: number;
    limit?: number;
    query?: string;
    location?: string;
    type?: string;
    workMode?: string;
    experienceLevel?: string;
  }): Promise<PaginatedResponse<Job>> {
    return ApiClient.get<PaginatedResponse<Job>>('/jobs', { params });
  }

  static async getById(id: string): Promise<Job> {
    return ApiClient.get<Job>(`/jobs/${id}`);
  }

  static async create(data: CreateJobDto): Promise<Job> {
    return ApiClient.post<Job>('/jobs', data);
  }

  static async update(id: string, data: UpdateJobDto): Promise<Job> {
    return ApiClient.patch<Job>(`/jobs/${id}`, data);
  }

  static async delete(id: string): Promise<void> {
    return ApiClient.delete(`/jobs/${id}`);
  }

  static async apply(id: string): Promise<void> {
    return ApiClient.post(`/jobs/${id}/apply`);
  }
}
```

---

### Query Hooks Pattern

**Location:** `apps/web/hooks/` or `apps/web/queries/`

Use TanStack Query for all data fetching with proper query keys.

```typescript
// apps/web/hooks/use-jobs.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JobService } from '@/services/job.service';
import type { Job, CreateJobDto } from '@/types';

// Query Keys - centralize for consistency
export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
};

// Fetch all jobs with filters
export function useJobs(filters?: { page?: number; limit?: number; query?: string; location?: string; type?: string }) {
  return useQuery({
    queryKey: jobKeys.list(filters ?? {}),
    queryFn: () => JobService.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch single job
export function useJob(id: string) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => JobService.getById(id),
    enabled: !!id,
  });
}

// Create job mutation
export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobDto) => JobService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

// Apply for job mutation
export function useApplyForJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => JobService.apply(jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
    },
  });
}
```

---

### Component Pattern

Components should be **presentational** and use hooks for data.

```typescript
// apps/web/components/jobs/JobList.tsx
'use client';

import { useJobs } from '@/hooks/use-jobs';
import { JobCard } from './JobCard';
import { JobListSkeleton } from './JobListSkeleton';
import { EmptyState } from '@/components/general/EmptyState';
import { ErrorState } from '@/components/general/ErrorState';

interface JobListProps {
  filters?: {
    query?: string;
    location?: string;
    type?: string;
  };
}

export function JobList({ filters }: JobListProps) {
  const { data, isLoading, isError, error, refetch } = useJobs(filters);

  // Always handle loading state
  if (isLoading) {
    return <JobListSkeleton count={6} />;
  }

  // Always handle error state
  if (isError) {
    return (
      <ErrorState
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  // Always handle empty state
  if (!data?.items?.length) {
    return (
      <EmptyState
        title="No jobs found"
        description="Try adjusting your search filters"
        icon="briefcase"
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.items.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
```

---

## 🎨 UI/UX Standards

> [!TIP] UI should look professional and polished. Think LinkedIn/Indeed quality.

### Required States for Every Async Component

1. **Loading State** - Skeletons, not spinners when possible
2. **Error State** - Clear message with retry action
3. **Empty State** - Helpful message and optional CTA
4. **Success State** - The actual content

### Styling Guidelines

- Use Tailwind CSS utility classes
- Mobile-first responsive design
- Use `@repo/ui` components (Button, Card, Input, etc.)
- Consistent spacing: `gap-4`, `space-y-4`, `p-4`, `p-6`
- Consistent rounded corners: `rounded-lg`, `rounded-xl`
- Use design tokens from the UI kit

### Forms

- Use `react-hook-form` with Zod validation
- Show inline validation errors
- Disable submit button while submitting
- Show loading state on submit button
- Use toast notifications for success/error messages

```typescript
// Form example with Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export function CreateJobForm() {
  const { mutate, isPending } = useCreateJob();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Job created successfully');
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create job');
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Job'}
      </Button>
    </form>
  );
}
```

---

## 📝 Type Definitions

**Location:** `apps/web/types/` or import from `@repo/shared-types`

```typescript
// apps/web/types/job.ts
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  skills: string[];
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  workMode: 'REMOTE' | 'HYBRID' | 'ONSITE';
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'DIRECTOR' | 'EXECUTIVE';
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  createdAt: string;
  company?: Company;
  postedBy?: User;
}

export interface CreateJobDto {
  title: string;
  description: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  type?: Job['type'];
  workMode?: Job['workMode'];
  experienceLevel?: Job['experienceLevel'];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

---

## ✅ Pre-Implementation Checklist

Before writing any code:

1. [ ] Read the Swagger docs for the endpoints you'll use
2. [ ] Check if a service already exists for this feature
3. [ ] Check if types are already defined
4. [ ] Check if similar components exist that can be reused
5. [ ] Plan all states: loading, error, empty, success
