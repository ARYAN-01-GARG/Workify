'use client';

import { useApplications } from '@/hooks/use-application';
import { ApplicationStatus } from '@/types/application';
import { Card, CardContent } from '@repo/ui/components/card';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Skeleton } from '@repo/ui/components/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EmptyMessage from '@/components/general/EmptyMessage';

interface ApplicationsListProps {
  jobId: string;
}

export function ApplicationsList({ jobId }: ApplicationsListProps) {
  const { data, isLoading, isError } = useApplications(jobId);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-24 w-full rounded-xl' />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-4 border border-destructive/20 bg-destructive/10 rounded-lg text-destructive flex items-center gap-2'>
        <AlertCircle className='h-5 w-5' />
        <span>Failed to load applications</span>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <EmptyMessage
        message='No applications yet'
        description='There are no candidates applied to this job yet.'
        icon={<User className='w-12 h-12 text-muted-foreground' />}
      />
    );
  }

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return 'bg-blue-100 text-blue-800';
      case ApplicationStatus.REVIEWING:
        return 'bg-purple-100 text-purple-800';
      case ApplicationStatus.SHORTLISTED:
        return 'bg-amber-100 text-amber-800';
      case ApplicationStatus.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-4'>
      {data.data.map((app) => (
        <Card
          key={app.id}
          className='hover:shadow-md transition-shadow cursor-pointer'
          onClick={() => router.push(`/jobs/${jobId}/applications/${app.id}`)}
        >
          <CardContent className='p-6 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-12 w-12'>
                <AvatarImage src={app.candidateProfile.user.avatarUrl} />
                <AvatarFallback>{app.candidateProfile.user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className='font-semibold text-lg'>{app.candidateProfile.user.name}</h4>
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <span>{app.candidateProfile.user.email}</span>
                  <span className='flex items-center gap-1'>
                    <Calendar className='h-3 w-3' />
                    Applied {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
              <Button variant='outline' size='sm'>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
