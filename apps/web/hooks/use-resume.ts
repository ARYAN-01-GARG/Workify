'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ResumeService } from '@/services/resume.service';

export const resumeKeys = {
  all: ['resumes'] as const,
  lists: () => [...resumeKeys.all, 'list'] as const,
};

export function useResumes() {
  return useQuery({
    queryKey: resumeKeys.lists(),
    queryFn: () => ResumeService.getMyResumes(),
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => ResumeService.uploadResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ResumeService.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
  });
}
