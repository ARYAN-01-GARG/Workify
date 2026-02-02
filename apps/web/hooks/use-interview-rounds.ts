import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InterviewRoundService, CreateRoundConfigDto } from '@/services/interview-round.service';
import { toast } from 'sonner';

export function useInterviewRounds(jobId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['interview-rounds', jobId],
    queryFn: () => InterviewRoundService.getAll(jobId),
    enabled: !!jobId,
  });

  const createRound = useMutation({
    mutationFn: (data: CreateRoundConfigDto) => InterviewRoundService.create(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-rounds', jobId] });
      toast.success('Interview round added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add interview round');
    },
  });

  const deleteRound = useMutation({
    mutationFn: (roundNumber: number) => InterviewRoundService.delete(jobId, roundNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-rounds', jobId] });
      toast.success('Interview round removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove interview round');
    },
  });

  return { ...query, createRound, deleteRound };
}
