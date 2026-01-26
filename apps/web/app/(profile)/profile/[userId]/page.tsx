'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUserProfile } from '@/hooks/use-profile';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileAbout } from '@/components/profile/profile-about';
import { ProfileExperience } from '@/components/profile/profile-experience';
import { ProfileEducation } from '@/components/profile/profile-education';
import { ProfilePosts } from '@/components/profile/profile-posts';
import { ConnectionRecommendations } from '@/components/profile/connection-recommendations';
import { Loader2, AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const { data: session } = useSession();

  // Redirect to own profile if viewing self
  if (session?.user?.id === userId) {
    redirect('/profile');
  }

  const { data: user, isLoading, error } = useUserProfile(userId);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <Loader2 className='h-8 w-8 animate-spin text-violet-500' />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-6 flex items-center gap-3 text-red-400'>
        <AlertCircle className='h-5 w-5' />
        <span>User not found or failed to load profile.</span>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto'>
      <ProfileHeader user={user} isOwnProfile={false} />

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Main Content Area (3 cols) */}
        <div className='lg:col-span-3 space-y-6'>
          {/* Bio & About */}
          <ProfileAbout user={user} isOwnProfile={false} />

          {/* Candidate Details */}
          {user.candidateProfile && (
            <>
              <ProfileExperience experience={user.candidateProfile.experience || []} isOwnProfile={false} />
              <ProfileEducation education={user.candidateProfile.education || []} isOwnProfile={false} />

              {/* Skills */}
              {user.candidateProfile.skills && user.candidateProfile.skills.length > 0 && (
                <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-lg shadow-black/20'>
                  <h2 className='text-lg font-bold text-white mb-4'>Skills</h2>
                  <div className='flex flex-wrap gap-2'>
                    {user.candidateProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className='bg-slate-800/50 text-slate-300 px-3 py-1.5 rounded-full text-sm font-medium border border-slate-700/50'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Recruiter Details */}
          {user.recruiterProfile?.company && (
            <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-lg shadow-black/20'>
              <h2 className='text-lg font-bold text-white mb-4'>Company</h2>
              <div className='flex items-center gap-3'>
                <div className='h-12 w-12 bg-slate-800 rounded-lg flex items-center justify-center text-xl font-bold text-violet-400'>
                  {user.recruiterProfile.company.name.charAt(0)}
                </div>
                <div>
                  <p className='font-bold text-white'>{user.recruiterProfile.company.name}</p>
                  <p className='text-sm text-slate-400'>Recruiter</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <ProfilePosts userId={user.id} />
        </div>

        {/* Right Sidebar (1 col) */}
        <div className='lg:col-span-1 space-y-6'>
          <ConnectionRecommendations />
        </div>
      </div>
    </div>
  );
}
