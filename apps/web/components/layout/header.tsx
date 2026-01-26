'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, MessageSquare, Bell, User, Settings, LogOut, Briefcase, Home, Users } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';

const navLinks = [
  { href: '/feed', label: 'Feed', icon: Home },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/connections', label: 'Network', icon: Users },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/notifications', label: 'Notifications', icon: Bell, badge: true },
];

const UserProfileMenu = () => {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return <div className='h-9 w-9 rounded-full bg-slate-800 animate-pulse'></div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex items-center gap-2 hover:bg-slate-800/60 p-1.5 pr-3 rounded-full transition-all duration-200 border border-transparent hover:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-violet-500/30'>
          <Avatar className='h-8 w-8 ring-2 ring-slate-800'>
            <AvatarImage src={user.avatarUrl || ''} alt={user.name || 'User'} />
            <AvatarFallback className='bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-sm font-bold'>
              {user.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className='text-sm font-medium text-slate-200 hidden xl:block max-w-[100px] truncate'>
            {user.name?.split(' ')[0]}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56 bg-slate-950 border-slate-800 shadow-xl shadow-black/40'>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium text-white'>{user.name}</p>
            <p className='text-xs text-slate-500 truncate'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='bg-slate-800' />
        <DropdownMenuItem asChild className='cursor-pointer text-slate-300 focus:bg-slate-800 focus:text-white'>
          <Link href={`/profile/${user.id}`}>
            <User className='mr-2 h-4 w-4' />
            View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className='cursor-pointer text-slate-300 focus:bg-slate-800 focus:text-white'>
          <Link href='/settings'>
            <Settings className='mr-2 h-4 w-4' />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className='bg-slate-800' />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: '/login' })}
          className='cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400'
        >
          <LogOut className='mr-2 h-4 w-4' />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className='sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl'>
      <div className='container flex h-16 items-center justify-between mx-auto px-4'>
        {/* Left: Logo + Search */}
        <div className='flex items-center gap-4 lg:gap-6'>
          <Link href='/' className='flex items-center space-x-3 group shrink-0'>
            <div className='h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 group-hover:scale-105 transition-all duration-300 ring-1 ring-white/10'>
              <span className='font-bold text-white text-xl'>W</span>
            </div>
            <span className='font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 hidden sm:inline-block tracking-tight'>
              Workify
            </span>
          </Link>

          {/* Search */}
          <div className='relative hidden lg:block w-64 group'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-violet-400 transition-colors' />
            <input
              placeholder='Search...'
              className='w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 placeholder:text-slate-500'
            />
          </div>
        </div>

        {/* Center: Nav Links */}
        <nav className='hidden md:flex items-center gap-1'>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                    ? 'text-white bg-slate-800/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                  }`}
              >
                <div className='relative'>
                  <Icon className='h-4 w-4' />
                  {link.badge && (
                    <span className='absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full' />
                  )}
                </div>
                <span className='hidden lg:inline'>{link.label}</span>
                {isActive && (
                  <span className='absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full' />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Profile */}
        <div className='flex items-center gap-2'>
          <div className='h-8 w-px bg-slate-800/60 hidden md:block' />
          <UserProfileMenu />
        </div>
      </div>

      {/* Mobile Nav */}
      <div className='md:hidden border-t border-slate-800/50 px-2 py-2 flex justify-around'>
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${isActive ? 'text-violet-400' : 'text-slate-500 hover:text-white'
                }`}
            >
              <div className='relative'>
                <Icon className='h-5 w-5' />
                {link.badge && (
                  <span className='absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full' />
                )}
              </div>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
