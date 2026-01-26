'use client';

import { useCallback, useState } from 'react';
import { useJobs } from '@/hooks/use-jobs';
import { JobCard } from './JobCard';
import { Skeleton } from '@repo/ui/components/skeleton';
import EmptyMessage from '@/components/general/EmptyMessage';
import { JobFilters } from './JobFilters';
import { Button } from '@repo/ui/components/button';
import { RefreshCw, Briefcase, Search } from 'lucide-react';
import type { JobQueryDto } from '@/types/job';

import { JobSearch } from './JobSearch';

export function JobList() {
    const [filters, setFilters] = useState<JobQueryDto>({});
    const { data, isLoading, isError, error, refetch } = useJobs(filters);

    const handleSearch = useCallback((query: string) => {
        setFilters(prev => ({ ...prev, query }));
    }, []);

    const handleFilterChange = useCallback((newFilters: JobQueryDto) => {
        setFilters(newFilters);
    }, []);

    const jobCount = data?.meta?.total || 0;

    return (
        <div className="space-y-6">
            {/* Search and Results Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 max-w-xl">
                    <JobSearch onSearch={handleSearch} initialValue={filters.query} />
                </div>
                {!isLoading && data?.data && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Search className="h-4 w-4" />
                        <span className="font-medium text-foreground">{jobCount}</span>
                        <span>job{jobCount !== 1 ? 's' : ''} found</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Job List */}
                <div className="lg:col-span-3 space-y-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="border rounded-xl p-6 space-y-4 bg-card">
                                    <div className="flex justify-between">
                                        <div className="flex gap-4">
                                            <Skeleton className="h-14 w-14 rounded-xl" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-5 w-48" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-8 w-24 rounded-full" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-7 w-24 rounded-lg" />
                                        <Skeleton className="h-7 w-20 rounded-lg" />
                                        <Skeleton className="h-7 w-28 rounded-lg" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-16 rounded-md" />
                                        <Skeleton className="h-6 w-20 rounded-md" />
                                        <Skeleton className="h-6 w-14 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border bg-destructive/5">
                            <div className="p-4 rounded-full bg-destructive/10 mb-4">
                                <RefreshCw className="h-8 w-8 text-destructive" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Failed to load jobs</h3>
                            <p className="text-muted-foreground mb-4">{error?.message}</p>
                            <Button onClick={() => refetch()} variant="outline">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                        </div>
                    ) : !data?.data?.length ? (
                        <EmptyMessage
                            message="No jobs found"
                            description="Try adjusting your search or filters to find what you're looking for."
                            icon={<Briefcase className="w-12 h-12 text-muted-foreground" />}
                        />
                    ) : (
                        <div className="space-y-4">
                            {data.data.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20">
                        <JobFilters filters={filters} onFilterChange={handleFilterChange} />
                    </div>
                </div>
            </div>
        </div>
    );
}
