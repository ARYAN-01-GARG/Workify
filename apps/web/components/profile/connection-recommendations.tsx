'use client';

import React from 'react';
import { Avatar, AvatarFallback } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { UserPlus } from 'lucide-react';

export function ConnectionRecommendations() {
  // Mock data for now since we don't have a recommendations API
  const recommendations = [
    {
      id: '1',
      name: 'Emily Chen',
      headline: 'Product Designer at Stripe',
      avatarUrl: null,
    },
    {
      id: '2',
      name: 'David Kim',
      headline: 'Senior Engineer at Vercel',
      avatarUrl: null,
    },
  ];

  return (
    <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-lg shadow-black/20'>
      <h2 className='text-lg font-bold text-white mb-4'>People you may know</h2>
      <div className='space-y-4'>
        {recommendations.map((user) => (
          <div key={user.id} className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-10 w-10 border border-slate-800'>
                <AvatarFallback className='bg-slate-800 text-slate-300 font-medium'>
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm font-bold text-white cursor-pointer hover:underline'>{user.name}</p>
                <p className='text-xs text-slate-400 line-clamp-1'>{user.headline}</p>
              </div>
            </div>
            <Button
              size='sm'
              variant='outline'
              className='h-8 w-8 p-0 rounded-full border-slate-700 text-slate-400 hover:text-violet-400 hover:border-violet-500 hover:bg-violet-500/10'
            >
              <UserPlus className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>
      <Button variant='link' className='w-full text-violet-400 text-sm mt-2'>
        Show more
      </Button>
    </div>
  );
}
