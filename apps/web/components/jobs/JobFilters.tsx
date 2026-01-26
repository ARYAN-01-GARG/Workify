'use client';

import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Button } from '@repo/ui/components/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/components/accordion';
import { X, Check, SlidersHorizontal } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';
import type { JobQueryDto } from '@/types/job';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

interface JobFiltersProps {
    filters: JobQueryDto;
    onFilterChange: (filters: JobQueryDto) => void;
}

export function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
    const [localLocation, setLocalLocation] = useState(filters.location || '');
    const [localSkills, setLocalSkills] = useState(filters.skills || '');

    // Store latest callback in ref for stable access
    const onFilterChangeRef = useRef(onFilterChange);
    onFilterChangeRef.current = onFilterChange;

    const debouncedLocation = useDebounce(localLocation, 500);
    const debouncedSkills = useDebounce(localSkills, 500);

    // Sync local state when filters are cleared or changed externally
    useEffect(() => {
        setLocalLocation(filters.location || '');
    }, [filters.location]);

    useEffect(() => {
        setLocalSkills(filters.skills || '');
    }, [filters.skills]);

    // Apply filters when debounced values change
    useEffect(() => {
        if (debouncedLocation !== (filters.location || '')) {
            onFilterChangeRef.current({ ...filters, location: debouncedLocation || undefined });
        }
    }, [debouncedLocation, filters.location]);

    useEffect(() => {
        if (debouncedSkills !== (filters.skills || '')) {
            onFilterChangeRef.current({ ...filters, skills: debouncedSkills || undefined });
        }
    }, [debouncedSkills, filters.skills]);

    const handleChange = (key: keyof JobQueryDto, value: string) => {
        onFilterChangeRef.current({ ...filters, [key]: value === 'ALL' ? undefined : value });
    };

    const handleClear = () => {
        onFilterChangeRef.current({});
    };

    const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

    const FilterOption = ({
        label,
        value,
        currentValue,
        onClick
    }: {
        label: string;
        value: string;
        currentValue: string;
        onClick: (val: string) => void;
    }) => {
        const isSelected = currentValue === value || (value === 'ALL' && !currentValue);

        return (
            <div
                onClick={() => onClick(value)}
                className={cn(
                    "flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all text-sm",
                    isSelected
                        ? "bg-primary text-primary-foreground font-medium shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
            >
                <span>{label}</span>
                {isSelected && <Check className="h-4 w-4" />}
            </div>
        );
    };

    return (
        <div className="space-y-4 p-5 border rounded-xl bg-card text-card-foreground shadow-sm">
            {/* Header with gradient */}
            <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                        <SlidersHorizontal className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Filters</h3>
                        {activeFiltersCount > 0 && (
                            <span className="text-xs text-muted-foreground">{activeFiltersCount} active</span>
                        )}
                    </div>
                </div>
                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="h-8 px-3 text-muted-foreground hover:text-destructive"
                    >
                        <X className="mr-1.5 h-3.5 w-3.5" />
                        Clear all
                    </Button>
                )}
            </div>

            {/* Sort By */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Sort By</Label>
                <div className="flex gap-2">
                    <Button
                        variant={filters.sortBy === 'newest' || !filters.sortBy ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleChange('sortBy', 'newest')}
                        className="flex-1 rounded-lg"
                    >
                        Newest
                    </Button>
                    <Button
                        variant={filters.sortBy === 'salary' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleChange('sortBy', 'salary')}
                        className="flex-1 rounded-lg"
                    >
                        Salary
                    </Button>
                </div>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                <Input
                    placeholder="City, state, or country"
                    value={localLocation}
                    onChange={(e) => setLocalLocation(e.target.value)}
                    className="rounded-lg"
                />
            </div>

            {/* Skills Input */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Skills</Label>
                <Input
                    placeholder="e.g. React, Node.js"
                    value={localSkills}
                    onChange={(e) => setLocalSkills(e.target.value)}
                    className="rounded-lg"
                />
            </div>

            <Accordion type="multiple" defaultValue={['type', 'workMode']} className="w-full space-y-2">
                <AccordionItem value="type" className="border rounded-lg px-3">
                    <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">Job Type</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-1 pb-2">
                            <FilterOption label="All Types" value="ALL" currentValue={filters.type || 'ALL'} onClick={(val) => handleChange('type', val)} />
                            {[
                                { value: 'FULL_TIME', label: 'Full Time' },
                                { value: 'PART_TIME', label: 'Part Time' },
                                { value: 'CONTRACT', label: 'Contract' },
                                { value: 'INTERNSHIP', label: 'Internship' },
                                { value: 'FREELANCE', label: 'Freelance' },
                            ].map((item) => (
                                <FilterOption key={item.value} label={item.label} value={item.value} currentValue={filters.type || 'ALL'} onClick={(val) => handleChange('type', val)} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="workMode" className="border rounded-lg px-3">
                    <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">Work Mode</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-1 pb-2">
                            <FilterOption label="All Modes" value="ALL" currentValue={filters.workMode || 'ALL'} onClick={(val) => handleChange('workMode', val)} />
                            {[
                                { value: 'REMOTE', label: 'Remote' },
                                { value: 'HYBRID', label: 'Hybrid' },
                                { value: 'ONSITE', label: 'Onsite' },
                            ].map((item) => (
                                <FilterOption key={item.value} label={item.label} value={item.value} currentValue={filters.workMode || 'ALL'} onClick={(val) => handleChange('workMode', val)} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="experience" className="border rounded-lg px-3">
                    <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">Experience Level</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-1 pb-2">
                            <FilterOption label="All Levels" value="ALL" currentValue={filters.experienceLevel || 'ALL'} onClick={(val) => handleChange('experienceLevel', val)} />
                            {[
                                { value: 'ENTRY', label: 'Entry Level' },
                                { value: 'MID', label: 'Mid Level' },
                                { value: 'SENIOR', label: 'Senior Level' },
                                { value: 'DIRECTOR', label: 'Director' },
                                { value: 'EXECUTIVE', label: 'Executive' },
                            ].map((item) => (
                                <FilterOption key={item.value} label={item.label} value={item.value} currentValue={filters.experienceLevel || 'ALL'} onClick={(val) => handleChange('experienceLevel', val)} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="datePosted" className="border rounded-lg px-3">
                    <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">Date Posted</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-1 pb-2">
                            <FilterOption label="Any Time" value="ALL" currentValue={filters.datePosted || 'ALL'} onClick={(val) => handleChange('datePosted', val)} />
                            {[
                                { value: 'LAST_24_HOURS', label: 'Last 24 Hours' },
                                { value: 'LAST_7_DAYS', label: 'Last 7 Days' },
                                { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
                            ].map((item) => (
                                <FilterOption key={item.value} label={item.label} value={item.value} currentValue={filters.datePosted || 'ALL'} onClick={(val) => handleChange('datePosted', val)} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
