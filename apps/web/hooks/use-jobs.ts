'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JobService } from '@/services/job.service';
import type { CreateJobDto, JobQueryDto, UpdateJobDto } from '@/types/job';

export const jobKeys = {
    all: ['jobs'] as const,
    lists: () => [...jobKeys.all, 'list'] as const,
    list: (filters: JobQueryDto) => [...jobKeys.lists(), filters] as const,
    details: () => [...jobKeys.all, 'detail'] as const,
    detail: (id: string) => [...jobKeys.details(), id] as const,
};

export function useJobs(filters: JobQueryDto = {}) {
    return useQuery({
        queryKey: jobKeys.list(filters),
        queryFn: () => JobService.getAll(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useJob(id: string) {
    return useQuery({
        queryKey: jobKeys.detail(id),
        queryFn: () => JobService.getById(id),
        enabled: !!id,
    });
}

export function useCreateJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateJobDto) => JobService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
        },
    });
}

export function useUpdateJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateJobDto }) =>
            JobService.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: jobKeys.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
        },
    });
}

export function useDeleteJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => JobService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
        },
    });
}

export function useApplyJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => JobService.apply(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
        },
    });
}
