'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/header';
import { SidebarFilters } from '@/components/feed/sidebar-filters';
import { UserProfileWidget } from '@/components/feed/user-profile-widget';
import { TrendingWidget } from '@/components/feed/trending-widget';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <div className='min-h-screen bg-slate-950 text-slate-200 selection:bg-violet-500/30 selection:text-violet-200'>
        <Header />

        {/* Main Grid Layout */}
        <main className='container py-6 mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-6'>
            {/* Left Sidebar - Navigation & Filters */}
            <aside className='hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar'>
              <SidebarFilters />
            </aside>

            {/* Center - Feed Content */}
            <div className='col-span-1 lg:col-span-6 min-h-screen pb-20'>{children}</div>

            {/* Right Sidebar - Profile & Widgets */}
            <aside className='hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar'>
              <UserProfileWidget />
              <TrendingWidget />
            </aside>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
};

export default MainLayout;
