'use client';

import React from 'react';
import { Home, Compass, MessageSquare, Bell, User, Briefcase, Bookmark, Settings, Filter, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@repo/ui/components/button';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => (
  <Link href={href} className='block mb-1.5'>
    <Button
      variant='ghost'
      className={`w-full justify-start gap-3 h-11 px-4 transition-all duration-200 ${active
        ? 'bg-gradient-to-r from-violet-500/10 to-transparent text-violet-400 border-l-2 border-violet-500 rounded-r-lg rounded-l-none'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-l-2 border-transparent hover:pl-5'
        }`}
    >
      <Icon className={`h-5 w-5 ${active ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
      <span className='font-medium'>{label}</span>
      {active && (
        <div className='ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]'></div>
      )}
    </Button>
  </Link>
);

export const SidebarFilters = () => {
  const pathname = usePathname();

  return (
    <div className='space-y-6'>
      {/* Main Navigation */}
      <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl overflow-hidden py-3 shadow-lg shadow-black/20'>
        <SidebarItem href='/feed' icon={Home} label='Feed' active={pathname === '/feed' || pathname === '/'} />
        <SidebarItem href='/connections' icon={Users} label='My Network' active={pathname === '/connections'} />
        <SidebarItem href='/explore' icon={Compass} label='Explore' active={pathname === '/explore'} />
        <SidebarItem href='/jobs' icon={Briefcase} label='Jobs' active={pathname.startsWith('/jobs')} />
        <SidebarItem href='/messages' icon={MessageSquare} label='Messages' active={pathname.startsWith('/messages')} />
        <SidebarItem
          href='/notifications'
          icon={Bell}
          label='Notifications'
          active={pathname.startsWith('/notifications')}
        />
        <SidebarItem href='/profile' icon={User} label='Profile' active={pathname.startsWith('/profile')} />
      </div>

      {/* Filters Section */}
      <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-4 shadow-lg shadow-black/20'>
        <div className='flex items-center gap-2 mb-4 px-2'>
          <Filter className='h-4 w-4 text-violet-400' />
          <h3 className='text-xs font-bold uppercase tracking-wider text-slate-500'>Filters</h3>
        </div>

        <div className='space-y-1'>
          <Button
            variant='ghost'
            className='w-full justify-start text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white h-9 px-3 rounded-lg hover:pl-4 transition-all'
          >
            Latest Posts
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white h-9 px-3 rounded-lg hover:pl-4 transition-all'
          >
            Top Trends
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white h-9 px-3 rounded-lg hover:pl-4 transition-all'
          >
            Media Only
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white h-9 px-3 rounded-lg hover:pl-4 transition-all'
          >
            Events
          </Button>
        </div>
      </div>

      <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl py-3 shadow-lg shadow-black/20'>
        <SidebarItem href='/saved' icon={Bookmark} label='Saved Items' active={pathname === '/saved'} />
        <SidebarItem href='/settings' icon={Settings} label='Settings' active={pathname === '/settings'} />
      </div>
    </div>
  );
};
