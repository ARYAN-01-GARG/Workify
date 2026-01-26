'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/header';

const JobsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <div className='min-h-screen bg-slate-950 text-slate-200 selection:bg-violet-500/30 selection:text-violet-200'>
                <Header />
                <main className='min-h-[calc(100vh-4rem)]'>
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
};

export default JobsLayout;
