'use client';

import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader } from '@repo/ui/components/card';
import { MapPin, Building2, Clock, Briefcase, DollarSign, Zap, CheckCircle2 } from 'lucide-react';
import type { Job, WorkMode, ExperienceLevel } from '@/types/job';
import { cn } from '@repo/ui/lib/utils';

interface JobCardProps {
  job: Job;
  isApplied?: boolean;
}

const workModeColors: Record<WorkMode, string> = {
  REMOTE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  HYBRID: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  ONSITE: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
};

const experienceLevelLabels: Record<ExperienceLevel, string> = {
  ENTRY: 'Entry Level',
  MID: 'Mid Level',
  SENIOR: 'Senior',
  DIRECTOR: 'Director',
  EXECUTIVE: 'Executive',
};

export function JobCard({ job, isApplied }: JobCardProps) {
  const router = useRouter();

  const formatSalary = (min?: number, max?: number, currency?: string) => {
    if (!min && !max) return null;
    const fmt = (n: number) => {
      if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
      return n.toString();
    };
    const curr = currency || 'USD';
    if (min && max) return `${curr} ${fmt(min)} - ${fmt(max)}`;
    if (min) return `${curr} ${fmt(min)}+`;
    return `Up to ${curr} ${fmt(max!)}`;
  };

  const salaryRange = formatSalary(job.salaryMin, job.salaryMax, job.currency);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden cursor-pointer transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5',
        'border-border/50 hover:border-primary/30',
        'bg-gradient-to-br from-card to-card/80',
        isApplied && 'border-green-500/20 bg-green-500/5',
      )}
      onClick={() => router.push(`/jobs/${job.id}`)}
    >
      {/* Accent gradient bar */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity',
          isApplied ? 'from-green-500 via-green-500/70 to-green-500/40' : 'from-primary via-primary/70 to-primary/40',
        )}
      />

      <CardHeader className='pb-3'>
        <div className='flex justify-between items-start gap-4'>
          <div className='flex gap-4'>
            {job.company?.logoUrl ? (
              <Image
                src={job.company.logoUrl}
                alt={job.company.name}
                width={56}
                height={56}
                className='w-14 h-14 rounded-xl object-cover ring-2 ring-border/50 shadow-sm'
                unoptimized
              />
            ) : (
              <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ring-2 ring-border/50 shadow-sm'>
                <Building2 className='w-7 h-7 text-primary/70' />
              </div>
            )}
            <div className='space-y-1'>
              <h3 className='text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1'>
                {job.title}
              </h3>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <span className='font-medium text-foreground/80'>{job.company?.name || 'Unknown Company'}</span>
                <span className='text-muted-foreground/50'>•</span>
                <span className='flex items-center gap-1'>
                  <MapPin className='w-3.5 h-3.5' />
                  {job.location}
                </span>
              </div>
            </div>
          </div>

          <div className='flex flex-col items-end gap-2'>
            {isApplied && (
              <div className='flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 shadow-sm'>
                <CheckCircle2 className='w-3.5 h-3.5' />
                <span className='text-xs font-semibold'>Applied</span>
              </div>
            )}
            {salaryRange && (
              <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20'>
                <DollarSign className='w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400' />
                <span className='text-sm font-semibold text-emerald-600 dark:text-emerald-400'>{salaryRange}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='pb-4 space-y-4'>
        {/* Type badges */}
        <div className='flex flex-wrap gap-2'>
          <Badge variant='outline' className='font-medium'>
            <Briefcase className='w-3 h-3 mr-1.5' />
            {job.type.replace('_', ' ')}
          </Badge>
          <Badge className={cn('font-medium border', workModeColors[job.workMode])}>
            <Zap className='w-3 h-3 mr-1.5' />
            {job.workMode}
          </Badge>
          <Badge variant='secondary' className='font-medium'>
            {experienceLevelLabels[job.experienceLevel]}
          </Badge>
        </div>

        {/* Skills */}
        <div className='flex flex-wrap gap-1.5'>
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className='px-2.5 py-1 text-xs font-medium rounded-md bg-muted/80 text-muted-foreground hover:bg-muted transition-colors'
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className='px-2.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary'>
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className='pt-0 flex justify-between items-center border-t border-border/50 mt-2 pt-4'>
        <div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
          <Clock className='w-3.5 h-3.5' />
          Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </div>
        <Button
          size='sm'
          className='rounded-full px-6 shadow-sm'
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/jobs/${job.id}`);
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
