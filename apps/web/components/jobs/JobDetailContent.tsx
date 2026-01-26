'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Badge } from '@repo/ui/components/badge';
import Image from 'next/image';
import { Building2, Globe, Users, MapPin, Briefcase, DollarSign, Target } from 'lucide-react';
import type { Job } from '@/types/job';
import { cn } from '@repo/ui/lib/utils';

interface JobDetailContentProps {
  job: Job;
}

export function JobDetailContent({ job }: JobDetailContentProps) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
      {/* Main Content */}
      <div className='lg:col-span-2 space-y-6'>
        {/* Job Description */}
        <Card className='overflow-hidden'>
          <CardHeader className='bg-gradient-to-r from-muted/50 to-muted/30 border-b'>
            <CardTitle className='flex items-center gap-2'>
              <Briefcase className='w-5 h-5 text-primary' />
              About the Role
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6'>
            <div className='prose dark:prose-invert max-w-none'>
              <p className='whitespace-pre-wrap text-muted-foreground leading-relaxed'>{job.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className='overflow-hidden'>
          <CardHeader className='bg-gradient-to-r from-muted/50 to-muted/30 border-b'>
            <CardTitle className='flex items-center gap-2'>
              <Target className='w-5 h-5 text-primary' />
              Required Skills
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6'>
            <div className='flex flex-wrap gap-3'>
              {job.skills.map((skill, index) => (
                <Badge
                  key={skill}
                  variant='secondary'
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-all hover:scale-105',
                    index % 3 === 0 && 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
                    index % 3 === 1 && 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
                    index % 3 === 2 && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                  )}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className='space-y-6'>
        <div className='sticky top-20 space-y-6'>
          {/* Quick Info */}
          <Card className='overflow-hidden'>
            <CardHeader className='bg-gradient-to-r from-primary/10 to-primary/5 border-b'>
              <CardTitle className='text-base'>Job Highlights</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='divide-y'>
                <div className='flex items-center gap-4 p-4'>
                  <div className='p-2.5 rounded-lg bg-blue-500/10'>
                    <Briefcase className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Job Type</p>
                    <p className='font-medium'>{job.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className='flex items-center gap-4 p-4'>
                  <div className='p-2.5 rounded-lg bg-emerald-500/10'>
                    <MapPin className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Work Mode</p>
                    <p className='font-medium'>{job.workMode}</p>
                  </div>
                </div>
                <div className='flex items-center gap-4 p-4'>
                  <div className='p-2.5 rounded-lg bg-purple-500/10'>
                    <Users className='w-5 h-5 text-purple-600 dark:text-purple-400' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Experience</p>
                    <p className='font-medium'>{job.experienceLevel}</p>
                  </div>
                </div>
                {job.salaryMin && job.salaryMax && (
                  <div className='flex items-center gap-4 p-4'>
                    <div className='p-2.5 rounded-lg bg-green-500/10'>
                      <DollarSign className='w-5 h-5 text-green-600 dark:text-green-400' />
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Salary Range</p>
                      <p className='font-medium'>
                        {job.currency} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card className='overflow-hidden'>
            <CardHeader className='border-b'>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Building2 className='w-5 h-5 text-primary' />
                About the Company
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6 space-y-4'>
              <div className='flex items-center gap-4'>
                {job.company?.logoUrl ? (
                  <Image
                    src={job.company.logoUrl}
                    alt={job.company.name}
                    width={56}
                    height={56}
                    className='w-14 h-14 rounded-xl object-cover ring-2 ring-border'
                    unoptimized
                  />
                ) : (
                  <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-border'>
                    <Building2 className='w-7 h-7 text-primary' />
                  </div>
                )}
                <div>
                  <h4 className='font-semibold'>{job.company?.name || 'Unknown Company'}</h4>
                  {job.company?.industry && <p className='text-sm text-muted-foreground'>{job.company.industry}</p>}
                </div>
              </div>

              {job.company?.description && (
                <p className='text-sm text-muted-foreground leading-relaxed'>{job.company.description}</p>
              )}

              {job.company?.location && (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <MapPin className='w-4 h-4' />
                  {job.company.location}
                </div>
              )}

              {job.company?.website && (
                <a
                  href={job.company.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline'
                >
                  <Globe className='w-4 h-4' />
                  Visit Website
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
