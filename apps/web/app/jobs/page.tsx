'use client';

import { JobList } from '@/components/jobs/JobList';
import { Button } from '@repo/ui/components/button';
import { Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/contexts/AuthContext';

export default function JobsPage() {
    const user = useAuth();
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 border-b">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="container mx-auto max-w-7xl py-12 px-4 relative">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-sm font-medium text-primary">Career Opportunities</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                                Find Your Dream Job
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-lg">
                                Discover opportunities that match your skills and aspirations. Your next career move starts here.
                            </p>
                        </div>

                        {/* Show only for recruiters */}
                        {user?.role === 'RECRUITER' && (
                            <Link href="/jobs/create">
                                <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 gap-2">
                                    <Plus className="h-5 w-5" />
                                    Post a Job
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <JobList />
            </div>
        </div>
    );
}
