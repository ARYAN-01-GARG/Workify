'use client';

import { Interview } from '@/types/application';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Badge } from '@repo/ui/components/badge';
import { format } from 'date-fns';
import { Calendar, User, Clock, CheckCircle2, XCircle, Timer } from 'lucide-react';

interface InterviewListProps {
  interviews: Interview[];
}

export function InterviewList({ interviews }: InterviewListProps) {
  if (!interviews.length) {
    return (
      <div className='text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-muted/30'>
        No interviews scheduled yet.
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'PASSED':
        return <CheckCircle2 className='h-5 w-5 text-green-500' />;
      case 'FAILED':
        return <XCircle className='h-5 w-5 text-red-500' />;
      case 'PENDING':
        return <Timer className='h-5 w-5 text-amber-500' />;
      default:
        return null;
    }
  };

  return (
    <div className='space-y-4'>
      {interviews.map((interview) => (
        <Card key={interview.id} className='overflow-hidden'>
          <CardHeader className='bg-muted/30 pb-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm'>
                  {interview.roundNumber}
                </div>
                <CardTitle className='text-base font-semibold'>{interview.roundType} Round</CardTitle>
              </div>
              <Badge variant='secondary' className={getStatusColor(interview.status)}>
                {interview.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className='pt-4 grid sm:grid-cols-2 gap-4'>
            <div className='space-y-3'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Calendar className='h-4 w-4' />
                <span>
                  {interview.scheduledAt ? format(new Date(interview.scheduledAt), 'PPP p') : 'Not scheduled'}
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <User className='h-4 w-4' />
                <span>Interviewer: {interview.assignedToUser.name}</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Clock className='h-4 w-4' />
                <span>Duration: 45 mins</span>
              </div>
            </div>

            <div className='border-l pl-4 space-y-3'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>Result:</span>
                <div className='flex items-center gap-2'>
                  {getResultIcon(interview.result)}
                  <span className='text-sm'>{interview.result}</span>
                </div>
              </div>
              {interview.rating && (
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium'>Rating:</span>
                  <div className='flex gap-1'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`h-2 w-2 rounded-full ${
                          star <= interview.rating! ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {interview.feedback && (
                <div className='mt-2 text-sm bg-muted/50 p-2 rounded'>
                  <p className='font-medium text-xs mb-1'>Feedback:</p>
                  <p className='italic text-muted-foreground'>{interview.feedback}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
