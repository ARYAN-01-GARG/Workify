'use client';

import { useParams, useRouter } from 'next/navigation';
import { useJob } from '@/hooks/use-jobs';
import { JobDetailHeader } from '@/components/jobs/JobDetailHeader';
import { JobDetailContent } from '@/components/jobs/JobDetailContent';
import { Skeleton } from '@repo/ui/components/skeleton';
import { Button } from '@repo/ui/components/button';
import { ArrowLeft, AlertCircle, Briefcase } from 'lucide-react';

export default function JobDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const jobId = Array.isArray(id) ? id[0] : id;
    const { data: job, isLoading, isError } = useJob(jobId!);

    if (isLoading) {
        return (
            <div className="min-h-screen">
                {/* Skeleton Header */}
                <div className="bg-gradient-to-br from-card via-card to-primary/5 border-b">
                    <div className="container mx-auto max-w-6xl py-8 px-4">
                        <Skeleton className="h-6 w-32 mb-6" />
                        <div className="rounded-2xl border bg-card p-8">
                            <div className="flex gap-6">
                                <Skeleton className="w-20 h-20 rounded-2xl" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-8 w-72" />
                                    <Skeleton className="h-5 w-96" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-24 rounded-full" />
                                        <Skeleton className="h-8 w-20 rounded-full" />
                                        <Skeleton className="h-8 w-28 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Skeleton Content */}
                <div className="container mx-auto max-w-6xl py-8 px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-64 rounded-xl" />
                            <Skeleton className="h-40 rounded-xl" />
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-72 rounded-xl" />
                            <Skeleton className="h-48 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !job) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="p-4 rounded-full bg-destructive/10 mb-6">
                    <AlertCircle className="w-12 h-12 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                    This job posting may have been removed or the link is incorrect.
                </p>
                <Button onClick={() => router.push('/jobs')} size="lg" className="rounded-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Jobs
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header Background */}
            <div className="bg-gradient-to-br from-background via-background to-primary/5">
                <div className="container mx-auto max-w-6xl py-6 px-4">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
                        onClick={() => router.push('/jobs')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Jobs
                    </Button>

                    <JobDetailHeader job={job} />
                    <JobDetailContent job={job} />
                </div>
            </div>
        </div>
    );
}
