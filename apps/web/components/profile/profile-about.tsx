'use client';

import React from 'react';
import { UserProfile } from '@/hooks/use-profile';
import { Edit2 } from 'lucide-react';
import { Button } from '@repo/ui/components/button';

interface ProfileAboutProps {
  user: UserProfile;
  isOwnProfile?: boolean;
}

export function ProfileAbout({ user, isOwnProfile = false }: ProfileAboutProps) {
  if (!user.about) {
    if (isOwnProfile) {
      return (
        <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col items-center justify-center text-center py-10 border-dashed border-2 border-slate-800 hover:border-slate-700 transition-colors group cursor-pointer'>
          <div className='h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors'>
            <Edit2 className='h-5 w-5 text-slate-400 group-hover:text-white' />
          </div>
          <h3 className='font-bold text-white mb-1'>Add About Section</h3>
          <p className='text-slate-400 text-sm'>Tell others about yourself and your background</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-lg shadow-black/20'>
      <div className='flex justify-between items-start mb-4'>
        <h2 className='text-lg font-bold text-white'>About</h2>
        {isOwnProfile && (
          <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-400 hover:text-white'>
            <Edit2 className='h-4 w-4' />
          </Button>
        )}
      </div>
      <p className='text-slate-300 text-sm leading-relaxed whitespace-pre-wrap'>{user.about}</p>
    </div>
  );
}
