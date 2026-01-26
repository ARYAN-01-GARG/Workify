'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Textarea } from '@repo/ui/components/textarea';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Label } from '@repo/ui/components/label';
import { UserProfile, Experience } from '@/hooks/use-profile';
import { UserService } from '@/services/user.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, Pencil, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

interface ExperienceFormData {
  title: string;
  companyName: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

interface EditExperienceFormProps {
  user: UserProfile;
}

export function EditExperienceForm({ user }: EditExperienceFormProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const initialExperience = (user.candidateProfile?.experience || []) as Experience[];
  const [experiences, setExperiences] = useState<Experience[]>(initialExperience);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    defaultValues: {
      currentlyWorking: false,
      employmentType: 'Full-time',
      title: '',
      companyName: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  const currentlyWorking = useWatch({ control, name: 'currentlyWorking' });

  const mutation = useMutation({
    mutationFn: (newExperiences: Experience[]) => UserService.updateCandidateProfile({ experience: newExperiences }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Experience updated');
      setIsEditing(false);
      setEditingIndex(null);
      reset();
    },
    onError: () => {
      toast.error('Failed to update experience');
    },
  });

  const onSubmit = (values: ExperienceFormData) => {
    const newExp: Experience = {
      id: editingIndex !== null ? experiences[editingIndex]?.id : undefined,
      title: values.title,
      companyName: values.companyName,
      employmentType: values.employmentType,
      location: values.location,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
      currentlyWorking: values.currentlyWorking,
      description: values.description,
    };

    let updatedStack: Experience[];
    if (editingIndex !== null) {
      updatedStack = [...experiences];
      updatedStack[editingIndex] = newExp;
    } else {
      updatedStack = [newExp, ...experiences];
    }

    setExperiences(updatedStack);
    mutation.mutate(updatedStack);
  };

  const handleDelete = (index: number) => {
    const updatedStack = experiences.filter((_, i) => i !== index);
    setExperiences(updatedStack);
    mutation.mutate(updatedStack);
  };

  const startEdit = (index: number) => {
    const exp = experiences[index];
    if (!exp) return;

    reset({
      title: exp.title,
      companyName: exp.companyName,
      employmentType: exp.employmentType || 'Full-time',
      location: exp.location || '',
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      currentlyWorking: exp.currentlyWorking || false,
      description: exp.description || '',
    });
    setEditingIndex(index);
    setIsEditing(true);
  };

  const startAdd = () => {
    reset({
      currentlyWorking: false,
      employmentType: 'Full-time',
      title: '',
      companyName: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setEditingIndex(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className='space-y-4 animate-in fade-in zoom-in-95 duration-200'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-lg font-medium text-white'>
            {editingIndex !== null ? 'Edit Experience' : 'Add Experience'}
          </h3>
          <Button variant='ghost' size='sm' onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                {...register('title', { required: 'Title is required' })}
                placeholder='Software Engineer'
                className='bg-slate-900 border-slate-800'
              />
              {errors.title && <p className='text-sm text-red-400'>{errors.title.message}</p>}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='companyName'>Company</Label>
              <Input
                id='companyName'
                {...register('companyName', { required: 'Company is required' })}
                placeholder='Acme Corp'
                className='bg-slate-900 border-slate-800'
              />
              {errors.companyName && <p className='text-sm text-red-400'>{errors.companyName.message}</p>}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='location'>Location</Label>
            <Input
              id='location'
              {...register('location')}
              placeholder='San Francisco, CA'
              className='bg-slate-900 border-slate-800'
            />
          </div>

          <div className='flex items-center space-x-3 p-2'>
            <Checkbox
              id='currentlyWorking'
              checked={currentlyWorking}
              onCheckedChange={(checked) => setValue('currentlyWorking', checked === true)}
            />
            <Label htmlFor='currentlyWorking' className='cursor-pointer'>
              I currently work here
            </Label>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='startDate'>Start Date</Label>
              <Input
                id='startDate'
                type='date'
                {...register('startDate', { required: 'Start date is required' })}
                className='bg-slate-900 border-slate-800'
              />
              {errors.startDate && <p className='text-sm text-red-400'>{errors.startDate.message}</p>}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='endDate'>End Date</Label>
              <Input
                id='endDate'
                type='date'
                {...register('endDate')}
                disabled={currentlyWorking}
                className='bg-slate-900 border-slate-800'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              {...register('description')}
              placeholder='Describe your responsibilities...'
              className='bg-slate-900 border-slate-800'
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-medium text-white'>Experience</h3>
        <Button onClick={startAdd} size='sm' className='gap-2'>
          <Plus className='h-4 w-4' /> Add Experience
        </Button>
      </div>

      <div className='space-y-3'>
        {experiences.map((exp, index) => (
          <div
            key={exp.id || index}
            className='bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex justify-between group'
          >
            <div className='flex gap-3'>
              <div className='h-10 w-10 mt-1 bg-slate-800 rounded flex items-center justify-center shrink-0'>
                <Briefcase className='h-5 w-5 text-violet-400' />
              </div>
              <div>
                <h4 className='font-bold text-white'>{exp.title}</h4>
                <p className='text-sm text-slate-300'>{exp.companyName}</p>
                <p className='text-xs text-slate-500 mt-1'>
                  {exp.startDate && format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                  {exp.currentlyWorking || !exp.endDate ? 'Present' : format(new Date(exp.endDate), 'MMM yyyy')}
                </p>
              </div>
            </div>
            <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-start'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-slate-400 hover:text-white'
                onClick={() => startEdit(index)}
              >
                <Pencil className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10'
                onClick={() => handleDelete(index)}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        ))}
        {experiences.length === 0 && (
          <p className='text-center py-8 text-slate-500 text-sm'>No experience listed. Add your work history.</p>
        )}
      </div>
    </div>
  );
}
