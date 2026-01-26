'use client';

import { useMyAppliedJobs } from '@/hooks/use-jobs';
import { JobCard } from './JobCard';
import { Skeleton } from '@repo/ui/components/skeleton';
import EmptyMessage from '@/components/general/EmptyMessage';
import { Button } from '@repo/ui/components/button';
import { RefreshCw, Briefcase } from 'lucide-react';

export function AppliedJobsList() {
  const { data: appliedJobs, isLoading, isError, error, refetch } = useMyAppliedJobs();

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {isLoading ? (
          <div className='space-y-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='border rounded-xl p-6 space-y-4 bg-card'>
                <div className='flex gap-4'>
                  <Skeleton className='h-14 w-14 rounded-xl' />
                  <div className='space-y-2 flex-1'>
                    <Skeleton className='h-5 w-48' />
                    <Skeleton className='h-4 w-32' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className='flex flex-col items-center justify-center py-16 text-center rounded-xl border bg-destructive/5'>
            <div className='p-4 rounded-full bg-destructive/10 mb-4'>
              <RefreshCw className='h-8 w-8 text-destructive' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Failed to load applied jobs</h3>
            <p className='text-muted-foreground mb-4'>{error?.message}</p>
            <Button onClick={() => refetch()} variant='outline'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Try Again
            </Button>
          </div>
        ) : !appliedJobs?.length ? (
          <EmptyMessage
            message='No applied jobs'
            description="You haven't applied to any jobs yet."
            icon={<Briefcase className='w-12 h-12 text-muted-foreground' />}
          />
        ) : (
          <div className='space-y-4'>
            {appliedJobs.map((job) => (
              <JobCard key={job.id} job={job} isApplied={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
