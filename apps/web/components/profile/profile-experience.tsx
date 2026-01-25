'use client';

import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { format } from 'date-fns';
import { Experience } from '@/hooks/use-profile';

interface ProfileExperienceProps {
  experience: Experience[];
  isOwnProfile?: boolean;
}

export function ProfileExperience({ experience, isOwnProfile = false }: ProfileExperienceProps) {
  if (!experience || experience.length === 0) {
    if (isOwnProfile) {
      return (
        <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col items-center justify-center text-center py-10 border-dashed border-2 border-slate-800 hover:border-slate-700 transition-colors group cursor-pointer'>
          <div className='h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors'>
            <Plus className='h-6 w-6 text-slate-400 group-hover:text-white' />
          </div>
          <h3 className='font-bold text-white mb-1'>Add Experience</h3>
          <p className='text-slate-400 text-sm'>Highlight your professional journey</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-lg shadow-black/20'>
      <div className='flex justify-between items-center mb-5'>
        <h2 className='text-lg font-bold text-white'>Experience</h2>
        {isOwnProfile && (
          <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-400 hover:text-white'>
            <Plus className='h-5 w-5' />
          </Button>
        )}
      </div>
      <div className='space-y-6'>
        {experience.map((exp, index) => (
          <div key={exp.id || index} className='flex gap-4'>
            <div className='flex-shrink-0 h-12 w-12 bg-slate-800 rounded-lg flex items-center justify-center'>
              <Briefcase className='h-6 w-6 text-violet-400' />
            </div>
            <div className='flex-1'>
              <h3 className='font-bold text-white'>{exp.title}</h3>
              <p className='text-sm text-slate-400'>
                {exp.companyName}
                {exp.location && ` · ${exp.location}`}
              </p>
              <p className='text-xs text-slate-500 mt-1'>
                {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                {exp.currentlyWorking || !exp.endDate ? 'Present' : format(new Date(exp.endDate), 'MMM yyyy')}
              </p>
              {exp.description && <p className='text-sm text-slate-300 mt-3 leading-relaxed'>{exp.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
