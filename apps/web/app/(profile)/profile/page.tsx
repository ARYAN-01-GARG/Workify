'use client';

import React, { useState } from 'react';
import { useCurrentUserProfile } from '@/hooks/use-profile';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileAbout } from '@/components/profile/profile-about';
import { ProfileExperience } from '@/components/profile/profile-experience';
import { ProfileEducation } from '@/components/profile/profile-education';
import { ProfilePosts } from '@/components/profile/profile-posts';
import { ConnectionRecommendations } from '@/components/profile/connection-recommendations';
import { RecommendedJobs } from '@/components/profile/recommended-jobs';
import { Loader2, AlertCircle, Plus, Edit2 } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { ProfileEditDialog } from '@/components/profile/edit/profile-edit-dialog';

export default function ProfilePage() {
  const { data: user, isLoading, error } = useCurrentUserProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState('basic');

  const openEdit = (tab: string) => {
    setDefaultTab(tab);
    setIsEditOpen(true);
  };

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
        <span>Failed to load profile. Please try again later.</span>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto'>
      <ProfileHeader user={user} isOwnProfile={true} onEditClick={() => openEdit('basic')} />

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Main Content Area (3 cols) */}
        <div className='lg:col-span-3 space-y-6'>
          {/* Bio & About */}
          <div className='relative group'>
            <ProfileAbout user={user} isOwnProfile={true} />
            <div className='absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-10'>
              {/* The component has its own edit button logic but we can also trigger from here if we want an overlay. 
                                Actually, ProfileAbout has its own button that does nothing currently. 
                                We should update ProfileAbout to accept onEditClick instead of just showing a button.
                             */}
            </div>
          </div>

          {/* Candidate Details */}
          {user.candidateProfile && (
            <>
              {/* We need to wire up the Edit/Add buttons in these components to openEdit */}

              <div onClick={() => openEdit('experience')} className='cursor-pointer'>
                <ProfileExperience experience={user.candidateProfile.experience || []} isOwnProfile={true} />
              </div>

              <div onClick={() => openEdit('education')} className='cursor-pointer'>
                <ProfileEducation education={user.candidateProfile.education || []} isOwnProfile={true} />
              </div>

              {/* Skills (Moved from Sidebar) */}
              {!user.candidateProfile.skills || user.candidateProfile.skills.length === 0 ? (
                <div
                  onClick={() => openEdit('skills')}
                  className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col items-center justify-center text-center py-10 border-dashed border-2 border-slate-800 hover:border-slate-700 transition-colors group cursor-pointer'
                >
                  <div className='h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors'>
                    <Plus className='h-6 w-6 text-slate-400 group-hover:text-white' />
                  </div>
                  <h3 className='font-bold text-white mb-1'>Add Skills</h3>
                  <p className='text-slate-400 text-sm'>Showcase your strengths</p>
                </div>
              ) : (
                <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-lg shadow-black/20'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-bold text-white'>Skills</h2>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-slate-400 hover:text-white'
                      onClick={() => openEdit('skills')}
                    >
                      <Edit2 className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {user.candidateProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className='bg-slate-800/50 text-slate-300 px-3 py-1.5 rounded-full text-sm font-medium border border-slate-700/50 hover:border-violet-500/50 hover:text-violet-300 transition-colors'
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

          {/* Recent Activity (Last) */}
          <ProfilePosts userId={user.id} />
        </div>

        {/* Right Sidebar (1 col) */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Recommended Jobs - only for candidates */}
          {user.candidateProfile && (
            <RecommendedJobs skills={user.candidateProfile.skills || []} />
          )}
          <ConnectionRecommendations />
        </div>
      </div>

      <ProfileEditDialog user={user} open={isEditOpen} onOpenChange={setIsEditOpen} defaultTab={defaultTab} />
    </div>
  );
}
