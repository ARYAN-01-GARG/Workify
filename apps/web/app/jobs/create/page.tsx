'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@repo/ui/components/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { Textarea } from '@repo/ui/components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select';
import { toast } from 'sonner';
import { JobService } from '@/services/job.service';
import { JobTypeValues, WorkModeValues, ExperienceLevelValues } from '@/types/job';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(JobTypeValues),
  workMode: z.enum(WorkModeValues),
  experienceLevel: z.enum(ExperienceLevelValues),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  currency: z.string().default('USD'),
  skills: z.string().min(1, 'Skills are required (comma separated)'),
  companyId: z.string().optional(), // In a real app, this might be pre-selected or dropdown
});

type JobFormValues = z.infer<typeof jobSchema>;

const CreateJobPage = () => {
  const router = useRouter();
  const user = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema as any),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      type: 'FULL_TIME',
      workMode: 'REMOTE',
      experienceLevel: 'MID',
      currency: 'USD',
      skills: '',
    },
  });

  async function onSubmit(data: JobFormValues) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      // Parse skills string to array
      const skillsArray = data.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...data,
        skills: skillsArray,
        companyId: (user as any).companyId || (user as any).company?.id,
      };

      const job = await JobService.create(payload as any);
      toast.success('Job posted successfully!');
      router.push(`/jobs/${job.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (user?.role !== 'RECRUITER') {
    return (
      <div className='container mx-auto py-12 text-center text-muted-foreground'>
        You must be a recruiter to post jobs.
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-muted/10 py-10 px-4'>
      <div className='container mx-auto max-w-2xl bg-card border rounded-xl shadow-sm p-6 md:p-8'>
        <Button variant='ghost' className='mb-6 -ml-2' onClick={() => router.back()}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back
        </Button>

        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Post a New Job</h1>
          <p className='text-muted-foreground'>Create a job listing to find your next great hire.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. Senior Frontend Engineer' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. San Francisco, CA' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='workMode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select mode' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WorkModeValues.map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JobTypeValues.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='experienceLevel'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select level' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ExperienceLevelValues.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe the role, responsibilities, and requirements...'
                      className='min-h-[150px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='skills'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills (Comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder='React, TypeScript, Node.js' {...field} />
                  </FormControl>
                  <FormDescription>Separate skills with commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='salaryMin'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Salary</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='e.g. 50000' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='salaryMax'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Salary</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='e.g. 80000' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {isSubmitting ? 'Creating Job...' : 'Post Job'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default CreateJobPage;
