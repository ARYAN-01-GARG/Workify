'use client';

import React from 'react';
import { GraduationCap, Plus } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { format } from 'date-fns';
import { Education } from '@/hooks/use-profile';

interface ProfileEducationProps {
  education: Education[];
  isOwnProfile?: boolean;
}

export function ProfileEducation({ education, isOwnProfile = false }: ProfileEducationProps) {
  if (!education || education.length === 0) {
    if (isOwnProfile) {
      return (
        <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col items-center justify-center text-center py-10 border-dashed border-2 border-slate-800 hover:border-slate-700 transition-colors group cursor-pointer'>
          <div className='h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors'>
            <Plus className='h-6 w-6 text-slate-400 group-hover:text-white' />
          </div>
          <h3 className='font-bold text-white mb-1'>Add Education</h3>
          <p className='text-slate-400 text-sm'>Share your academic background</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-lg shadow-black/20'>
      <div className='flex justify-between items-center mb-5'>
        <h2 className='text-lg font-bold text-white'>Education</h2>
        {isOwnProfile && (
          <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-400 hover:text-white'>
            <Plus className='h-5 w-5' />
          </Button>
        )}
      </div>
      <div className='space-y-6'>
        {education.map((edu, index) => (
          <div key={edu.id || index} className='flex gap-4'>
            <div className='flex-shrink-0 h-12 w-12 bg-slate-800 rounded-lg flex items-center justify-center'>
              <GraduationCap className='h-6 w-6 text-blue-400' />
            </div>
            <div className='flex-1'>
              <h3 className='font-bold text-white'>{edu.school}</h3>
              <p className='text-sm text-slate-400'>
                {edu.degree}
                {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
              </p>
              <p className='text-xs text-slate-500 mt-1'>
                {format(new Date(edu.startDate), 'yyyy')} -{' '}
                {edu.endDate ? format(new Date(edu.endDate), 'yyyy') : 'Present'}
              </p>
              {edu.description && <p className='text-sm text-slate-300 mt-3 leading-relaxed'>{edu.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
