'use client';

import React from 'react';
import { Button } from '@repo/ui/components/button';
import { MoreHorizontal, ArrowUpRight, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';

export const TrendingWidget = () => {
  const trends = [
    { title: '#RemoteWork', count: '125k', category: 'Career' },
    { title: '#TechLayoffs', count: '89k', category: 'Industry' },
    { title: 'OpenAI', count: '56k', category: 'Technology' },
    { title: 'React 19', count: '42k', category: 'Development' },
  ];

  const suggestions = [
    { name: 'Sarah Wilson', role: 'Product Designer', avatar: null },
    { name: 'Tech Insider', role: 'Technology News', avatar: null },
  ];

  return (
    <div className='space-y-6'>
      {/* Trending Section */}
      <div className='bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-5'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-bold text-white'>Trending Now</h3>
          <Button variant='ghost' size='icon' className='h-6 w-6 text-slate-500 hover:text-white'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </div>

        <div className='space-y-4'>
          {trends.map((topic, i) => (
            <div key={i} className='group cursor-pointer'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='text-xs text-slate-500 mb-0.5'>{topic.category} · Trending</p>
                  <p className='font-semibold text-slate-200 text-sm group-hover:text-violet-400 transition-colors'>
                    {topic.title}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <ArrowUpRight className='h-4 w-4' />
                </Button>
              </div>
              <p className='text-xs text-slate-500 mt-1'>{topic.count} posts</p>
            </div>
          ))}
        </div>

        <Button variant='link' className='text-violet-400 text-sm p-0 mt-5 h-auto hover:text-violet-300'>
          Show all trends
        </Button>
      </div>

      {/* Suggested Follows Section */}
      <div className='bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-5'>
        <h3 className='font-bold text-white mb-4'>Who to follow</h3>
        <div className='space-y-4'>
          {suggestions.map((person, i) => (
            <div key={i} className='flex items-center justify-between group'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-10 w-10 border border-slate-800'>
                  <AvatarFallback className='bg-slate-800 text-slate-300 text-xs'>
                    {person.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm font-semibold text-white group-hover:underline cursor-pointer'>{person.name}</p>
                  <p className='text-xs text-slate-400'>{person.role}</p>
                </div>
              </div>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 rounded-full border-slate-700 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
        <Button variant='link' className='text-slate-400 text-sm p-0 mt-5 h-auto hover:text-white'>
          View all suggestions
        </Button>
      </div>

      {/* Footer Links */}
      <div className='flex flex-wrap gap-x-4 gap-y-2 px-2'>
        {['About', 'Accessibility', 'Help Center', 'Privacy & Terms', 'Ad Choices'].map((item) => (
          <a key={item} href='#' className='text-xs text-slate-500 hover:text-slate-300 transition-colors'>
            {item}
          </a>
        ))}
        <p className='text-xs text-slate-600 w-full mt-2'>© 2024 Workify Corp.</p>
      </div>
    </div>
  );
};
