'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { useJobs } from '@/hooks/use-jobs';
import { Skeleton } from '@repo/ui/components/skeleton';

interface RecommendedJobsProps {
  skills?: string[];
  limit?: number;
}

export function RecommendedJobs({ skills = [], limit = 2 }: RecommendedJobsProps) {
  // Search for jobs matching user's skills
  const searchQuery = skills.slice(0, 3).join(' '); // Use first 3 skills as search query

  const { data, isLoading } = useJobs({
    query: searchQuery || undefined,
    limit,
  });

  const jobs = data?.data || [];

  if (isLoading) {
    return (
      <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-5 shadow-lg shadow-black/20'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-bold text-white flex items-center gap-2'>
            <Briefcase className='h-4 w-4 text-violet-400' />
            Jobs for you
          </h3>
        </div>
        <div className='space-y-4'>
          {[1, 2].map((i) => (
            <div key={i} className='space-y-2'>
              <Skeleton className='h-4 w-3/4 bg-slate-800' />
              <Skeleton className='h-3 w-1/2 bg-slate-800' />
              <Skeleton className='h-3 w-1/3 bg-slate-800' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return null; // Don't show section if no jobs found
  }

  return (
    <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-5 shadow-lg shadow-black/20'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='font-bold text-white flex items-center gap-2'>
          <Briefcase className='h-4 w-4 text-violet-400' />
          Jobs for you
        </h3>
      </div>

      <div className='space-y-4'>
        {jobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`} className='block group'>
            <div className='p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 hover:border-violet-500/30 transition-all duration-200'>
              <h4 className='font-semibold text-white text-sm group-hover:text-violet-400 transition-colors line-clamp-1'>
                {job.title}
              </h4>

              <div className='flex items-center gap-1.5 mt-1.5 text-xs text-slate-400'>
                <Building2 className='h-3 w-3' />
                <span className='line-clamp-1'>{job.company?.name || 'Company'}</span>
              </div>

              {job.location && (
                <div className='flex items-center gap-1.5 mt-1 text-xs text-slate-500'>
                  <MapPin className='h-3 w-3' />
                  <span className='line-clamp-1'>{job.location}</span>
                </div>
              )}

              {job.salaryMin && job.salaryMax && (
                <p className='text-xs text-emerald-400 mt-2 font-medium'>
                  ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <Link href='/jobs'>
        <Button
          variant='ghost'
          size='sm'
          className='w-full mt-4 text-slate-400 hover:text-white hover:bg-slate-800/50 gap-2'
        >
          View all jobs
          <ArrowRight className='h-4 w-4' />
        </Button>
      </Link>
    </div>
  );
}
