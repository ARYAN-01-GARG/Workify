import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JobService } from '@/services/job.service';
import { ApplicationStatus } from '@/types/application';
import { toast } from 'sonner';

export function useApplication(jobId: string, applicationId: string) {
  return useQuery({
    queryKey: ['application', jobId, applicationId],
    queryFn: () => JobService.getApplication(jobId, applicationId),
    enabled: !!jobId && !!applicationId,
    retry: false,
  });
}

export function useUpdateApplicationStatus(jobId: string, applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: ApplicationStatus) => JobService.updateApplicationStatus(jobId, applicationId, status),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['application', jobId, applicationId] });
      queryClient.invalidateQueries({ queryKey: ['job-applications', jobId] });
      toast.success(`Application status updated to ${status}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update application status');
    },
  });
}

export function useApplications(jobId: string) {
  return useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: () => JobService.getApplications(jobId),
    enabled: !!jobId,
  });
}
