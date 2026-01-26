'use client';

import React from 'react';
import { Button } from '@repo/ui/components/button';
import { MoreHorizontal, ArrowUpRight, Plus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@repo/ui/components/avatar';

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
      <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-5 shadow-lg shadow-black/20'>
        <div className='flex justify-between items-center mb-5'>
          <h3 className='font-bold text-white text-base'>Trending Now</h3>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800/50 rounded-full transition-all'
          >
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </div>

        <div className='space-y-1'>
          {trends.map((topic, i) => (
            <div
              key={i}
              className='group cursor-pointer p-2.5 -mx-2.5 rounded-xl hover:bg-slate-800/40 transition-all duration-200'
            >
              <div className='flex justify-between items-start'>
                <div>
                  <p className='text-[11px] font-medium text-slate-500 mb-0.5 tracking-wide'>
                    {topic.category} · Trending
                  </p>
                  <p className='font-bold text-slate-200 text-sm group-hover:text-violet-400 transition-colors'>
                    {topic.title}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6 text-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-violet-500/10 hover:text-violet-400 rounded-full'
                >
                  <ArrowUpRight className='h-3.5 w-3.5' />
                </Button>
              </div>
              <p className='text-xs text-slate-500 mt-1 font-medium'>{topic.count} posts</p>
            </div>
          ))}
        </div>

        <Button variant='link' className='text-violet-400 text-sm p-0 mt-4 h-auto hover:text-violet-300 font-medium'>
          Show all trends
        </Button>
      </div>

      {/* Suggested Follows Section */}
      <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-5 shadow-lg shadow-black/20'>
        <h3 className='font-bold text-white mb-5 text-base'>Who to follow</h3>
        <div className='space-y-5'>
          {suggestions.map((person, i) => (
            <div key={i} className='flex items-center justify-between group'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-10 w-10 border border-slate-800 ring-2 ring-transparent group-hover:ring-violet-500/20 transition-all'>
                  <AvatarFallback className='bg-slate-800 text-slate-300 text-xs font-bold'>
                    {person.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm font-bold text-white group-hover:text-violet-400 transition-colors cursor-pointer'>
                    {person.name}
                  </p>
                  <p className='text-xs text-slate-400 font-medium'>{person.role}</p>
                </div>
              </div>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 rounded-full bg-slate-900/50 border-slate-700 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
        <Button variant='link' className='text-slate-400 text-sm p-0 mt-5 h-auto hover:text-white font-medium'>
          View all suggestions
        </Button>
      </div>

      {/* Footer Links */}
      <div className='flex flex-wrap gap-x-4 gap-y-2 px-2'>
        {['About', 'Accessibility', 'Help Center', 'Privacy & Terms', 'Ad Choices'].map((item) => (
          <a
            key={item}
            href='#'
            className='text-[11px] font-medium text-slate-500 hover:text-slate-300 transition-colors'
          >
            {item}
          </a>
        ))}
        <p className='text-[11px] text-slate-600 w-full mt-2 font-medium'>© 2024 Workify Corp.</p>
      </div>
    </div>
  );
};
