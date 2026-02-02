'use client';

import { useState } from 'react';
import { useInterviewRounds } from '@/hooks/use-interview-rounds';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { Skeleton } from '@repo/ui/components/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { InterviewRoundType } from '@/types/interview';

interface RoundConfigListProps {
  jobId: string;
  canEdit: boolean;
}

export function RoundConfigList({ jobId, canEdit }: RoundConfigListProps) {
  const { data: rounds, isLoading, isError, createRound, deleteRound } = useInterviewRounds(jobId);
  const [selectedType, setSelectedType] = useState<InterviewRoundType | ''>('');

  const nextRoundNumber = (rounds?.length || 0) + 1;

  const handleAdd = () => {
    if (selectedType) {
      createRound.mutate({
        roundType: selectedType as InterviewRoundType,
        roundNumber: nextRoundNumber,
        isRequired: true,
      });
      setSelectedType('');
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-20 w-full' />
        <Skeleton className='h-20 w-full' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-4 border border-destructive/20 bg-destructive/10 rounded-lg text-destructive flex items-center gap-2'>
        <AlertCircle className='h-5 w-5' />
        <span>Failed to load interview rounds</span>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Interview Pipeline</h3>
          <p className='text-sm text-muted-foreground'>Configure the interview stages for this job.</p>
        </div>
      </div>

      <div className='space-y-4'>
        {rounds?.length === 0 && (
          <div className='text-center py-8 text-muted-foreground border border-dashed rounded-lg'>
            No interview rounds configured yet.
          </div>
        )}
        {rounds?.map((round, index) => (
          <Card key={round.id}>
            <CardContent className='flex items-center justify-between p-4'>
              <div className='flex items-center gap-4'>
                <div className='bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center font-bold'>
                  {index + 1}
                </div>
                <div>
                  <p className='font-medium'>{round.roundType} Round</p>
                  <p className='text-xs text-muted-foreground'>{round.isRequired ? 'Required' : 'Optional'}</p>
                </div>
              </div>
              {canEdit && (
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive hover:text-destructive/80 hover:bg-destructive/10'
                  onClick={() => deleteRound.mutate(round.roundNumber)}
                  disabled={deleteRound.isPending}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {canEdit && (
        <div className='border border-dashed rounded-lg p-4 bg-muted/30 flex items-center gap-4'>
          <div className='flex-1'>
            <Select value={selectedType} onValueChange={(val) => setSelectedType(val as InterviewRoundType)}>
              <SelectTrigger>
                <SelectValue placeholder='Select Round Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='TECHNICAL'>Technical Round</SelectItem>
                <SelectItem value='HR'>HR Round</SelectItem>
                <SelectItem value='FINAL'>Final Round</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} disabled={!selectedType || createRound.isPending}>
            <Plus className='mr-2 h-4 w-4' />
            Add Round
          </Button>
        </div>
      )}
    </div>
  );
}
