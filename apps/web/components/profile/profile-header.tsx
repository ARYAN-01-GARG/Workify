'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Camera, Edit2, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { UserProfile } from '@/types';

interface ProfileHeaderProps {
  user: UserProfile;
  isOwnProfile: boolean;
  onEditClick?: () => void;
}

export function ProfileHeader({ user, isOwnProfile, onEditClick }: ProfileHeaderProps) {
  const headline =
    user.candidateProfile?.headline ||
    (user.recruiterProfile?.company?.name ? `Recruiter at ${user.recruiterProfile.company.name}` : user.role);

  const connectionCount = (user._count?.sentRequests || 0) + (user._count?.receivedRequests || 0);

  // Get location from user data (if available)
  const location = user.location;

  // Get website from user data (if available)
  const website = user.website;

  return (
    <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl overflow-hidden shadow-lg shadow-black/20'>
      {/* Cover Image */}
      <div className='h-48 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 relative overflow-hidden'>
        <div className='absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] opacity-30 mix-blend-overlay'></div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
        {isOwnProfile && (
          <Button
            variant='ghost'
            size='icon'
            className='absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm'
          >
            <Camera className='h-4 w-4' />
          </Button>
        )}
      </div>

      {/* Profile Info */}
      <div className='px-6 pb-6 relative'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-end -mt-16 mb-4 gap-4'>
          <div className='relative'>
            <Avatar className='h-32 w-32 border-4 border-slate-950 shadow-xl ring-2 ring-slate-800'>
              <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
              <AvatarFallback className='bg-slate-800 text-violet-400 text-4xl font-bold'>
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <Button
                variant='ghost'
                size='icon'
                className='absolute bottom-0 right-0 bg-slate-800 hover:bg-slate-700 text-white rounded-full h-8 w-8 border border-slate-700'
              >
                <Camera className='h-3.5 w-3.5' />
              </Button>
            )}
          </div>

          <div className='flex gap-2 sm:mb-2'>
            {isOwnProfile ? (
              <Button
                variant='outline'
                onClick={onEditClick}
                className='bg-slate-900/50 border-slate-700 text-slate-200 hover:text-white hover:border-violet-500 hover:bg-violet-500/10'
              >
                <Edit2 className='h-4 w-4 mr-2' />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button className='bg-violet-600 hover:bg-violet-700 text-white'>Connect</Button>
                <Button
                  variant='outline'
                  className='bg-slate-900/50 border-slate-700 text-slate-200 hover:text-white hover:border-slate-600'
                >
                  Message
                </Button>
              </>
            )}
          </div>
        </div>

        <div className='space-y-3'>
          <div>
            <h1 className='text-2xl font-bold text-white'>{user.name}</h1>
            <p className='text-slate-400 mt-1'>{headline}</p>
          </div>

          {user.bio && <p className='text-slate-300 text-sm'>{user.bio}</p>}

          <div className='flex flex-wrap gap-4 text-sm text-slate-500'>
            {location && (
              <div className='flex items-center gap-1'>
                <MapPin className='h-4 w-4' />
                <span>{location}</span>
              </div>
            )}
            {website && (
              <div className='flex items-center gap-1'>
                <LinkIcon className='h-4 w-4' />
                <a
                  href={website.startsWith('http') ? website : `https://${website}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-violet-400 hover:underline'
                >
                  {website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className='flex items-center gap-1'>
              <Calendar className='h-4 w-4' />
              <span>Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
            </div>
          </div>

          <div className='flex gap-6 pt-2'>
            <Link href='/connections' className='text-sm hover:opacity-80 transition-opacity'>
              <span className='font-bold text-white'>{connectionCount}</span>
              <span className='text-slate-500 ml-1'>connections</span>
            </Link>
            <div className='text-sm'>
              <span className='font-bold text-white'>{user._count?.posts || 0}</span>
              <span className='text-slate-500 ml-1'>posts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
