import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Building2, MapPin, DollarSign, Share2, Bookmark, Clock, Briefcase, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useMyApplication } from '@/hooks/use-jobs';
import { toast } from 'sonner';
import { ApplyJobDialog } from './apply-job-dialog';
import type { Job, WorkMode, ExperienceLevel } from '@/types/job';
import { cn } from '@repo/ui/lib/utils';

interface JobDetailHeaderProps {
  job: Job;
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

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const { data: myApplication, isLoading: isLoadingApplication } = useMyApplication(job.id);
  const isApplied = !!myApplication;

  // We moved useApplyJob to the dialog, but we might want to check if user has already applied
  // For now, simple open dialog

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const formatSalary = (min?: number, max?: number, currency?: string) => {
    if (!min && !max) return null;
    const fmt = (n: number) => `${(n / 1000).toFixed(0)}k`;
    const curr = currency || 'USD';
    if (min && max) return `${curr} ${fmt(min)} - ${fmt(max)}/year`;
    if (min) return `${curr} ${fmt(min)}+/year`;
    return `Up to ${curr} ${fmt(max!)}/year`;
  };

  const salaryRange = formatSalary(job.salaryMin, job.salaryMax, job.currency);

  return (
    <>
      <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border shadow-sm mb-8'>
        {/* Top accent */}
        <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-primary/40' />

        <div className='p-8'>
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Company Logo & Info */}
            <div className='flex-1'>
              <div className='flex gap-6'>
                {/* Logo */}
                <div className='shrink-0'>
                  {job.company?.logoUrl ? (
                    <Image
                      src={job.company.logoUrl}
                      alt={job.company.name}
                      width={80}
                      height={80}
                      className='w-20 h-20 rounded-2xl object-cover ring-4 ring-background shadow-lg'
                      unoptimized
                    />
                  ) : (
                    <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-4 ring-background shadow-lg'>
                      <Building2 className='w-10 h-10 text-primary' />
                    </div>
                  )}
                </div>

                {/* Title & Meta */}
                <div className='space-y-3'>
                  <div>
                    <h1 className='text-3xl font-bold tracking-tight mb-2'>{job.title}</h1>
                    <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground'>
                      <span className='flex items-center gap-1.5 font-medium text-foreground'>
                        <Building2 className='w-4 h-4 text-primary' />
                        {job.company?.name || 'Unknown Company'}
                      </span>
                      <span className='flex items-center gap-1.5'>
                        <MapPin className='w-4 h-4' />
                        {job.location}
                      </span>
                      <span className='flex items-center gap-1.5'>
                        <Clock className='w-4 h-4' />
                        Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className='flex flex-wrap gap-2'>
                    <Badge variant='outline' className='px-3 py-1 font-medium'>
                      <Briefcase className='w-3.5 h-3.5 mr-1.5' />
                      {job.type.replace('_', ' ')}
                    </Badge>
                    <Badge className={cn('px-3 py-1 font-medium border', workModeColors[job.workMode])}>
                      <Zap className='w-3.5 h-3.5 mr-1.5' />
                      {job.workMode}
                    </Badge>
                    <Badge variant='secondary' className='px-3 py-1 font-medium'>
                      {experienceLevelLabels[job.experienceLevel]}
                    </Badge>
                    <Badge variant={job.status === 'OPEN' ? 'default' : 'secondary'} className='px-3 py-1'>
                      {job.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions & Salary */}
            <div className='flex flex-col gap-4 lg:items-end lg:min-w-[240px]'>
              {/* Salary */}
              {salaryRange && (
                <div className='flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20'>
                  <DollarSign className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
                  <span className='text-lg font-bold text-emerald-600 dark:text-emerald-400'>{salaryRange}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex gap-3'>
                {isApplied ? (
                  <Button
                    size='lg'
                    disabled
                    className='rounded-full px-8 bg-green-600/20 text-green-600 hover:bg-green-600/20 border border-green-600/20'
                  >
                    Applied
                  </Button>
                ) : (
                  <Button
                    size='lg'
                    onClick={() => setShowApplyDialog(true)}
                    disabled={job.status !== 'OPEN' || isLoadingApplication}
                    className='rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all'
                  >
                    Apply Now
                  </Button>
                )}
                <Button variant='outline' size='lg' onClick={handleShare} className='rounded-full'>
                  <Share2 className='w-4 h-4' />
                </Button>
                <Button variant='outline' size='lg' className='rounded-full'>
                  <Bookmark className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplyJobDialog jobId={job.id} jobTitle={job.title} open={showApplyDialog} onOpenChange={setShowApplyDialog} />
    </>
  );
}
