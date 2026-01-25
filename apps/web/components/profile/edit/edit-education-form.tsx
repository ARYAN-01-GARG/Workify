'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Textarea } from '@repo/ui/components/textarea';
import { Label } from '@repo/ui/components/label';
import { UserProfile, Education } from '@/hooks/use-profile';
import { UserService } from '@/services/user.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, Pencil, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

interface EducationFormData {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EditEducationFormProps {
  user: UserProfile;
}

export function EditEducationForm({ user }: EditEducationFormProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const initialEducation = (user.candidateProfile?.education || []) as Education[];
  const [educations, setEducations] = useState<Education[]>(initialEducation);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationFormData>({
    defaultValues: {
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (newEducation: Education[]) => UserService.updateCandidateProfile({ education: newEducation }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Education updated');
      setIsEditing(false);
      setEditingIndex(null);
      reset();
    },
    onError: () => {
      toast.error('Failed to update education');
    },
  });

  const onSubmit = (values: EducationFormData) => {
    const newEdu: Education = {
      id: editingIndex !== null ? educations[editingIndex]?.id : undefined,
      school: values.school,
      degree: values.degree,
      fieldOfStudy: values.fieldOfStudy,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
      description: values.description,
    };

    let updatedStack: Education[];
    if (editingIndex !== null) {
      updatedStack = [...educations];
      updatedStack[editingIndex] = newEdu;
    } else {
      updatedStack = [newEdu, ...educations];
    }

    setEducations(updatedStack);
    mutation.mutate(updatedStack);
  };

  const handleDelete = (index: number) => {
    const updatedStack = educations.filter((_, i) => i !== index);
    setEducations(updatedStack);
    mutation.mutate(updatedStack);
  };

  const startEdit = (index: number) => {
    const edu = educations[index];
    if (!edu) return;

    reset({
      school: edu.school,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
      description: edu.description || '',
    });
    setEditingIndex(index);
    setIsEditing(true);
  };

  const startAdd = () => {
    reset({
      school: '',
      degree: '',
      fieldOfStudy: '',
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
            {editingIndex !== null ? 'Edit Education' : 'Add Education'}
          </h3>
          <Button variant='ghost' size='sm' onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='school'>School</Label>
            <Input
              id='school'
              {...register('school', { required: 'School is required' })}
              placeholder='Stanford University'
              className='bg-slate-900 border-slate-800'
            />
            {errors.school && <p className='text-sm text-red-400'>{errors.school.message}</p>}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='degree'>Degree</Label>
              <Input
                id='degree'
                {...register('degree', { required: 'Degree is required' })}
                placeholder="Bachelor's"
                className='bg-slate-900 border-slate-800'
              />
              {errors.degree && <p className='text-sm text-red-400'>{errors.degree.message}</p>}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='fieldOfStudy'>Field of Study</Label>
              <Input
                id='fieldOfStudy'
                {...register('fieldOfStudy', { required: 'Field of study is required' })}
                placeholder='Computer Science'
                className='bg-slate-900 border-slate-800'
              />
              {errors.fieldOfStudy && <p className='text-sm text-red-400'>{errors.fieldOfStudy.message}</p>}
            </div>
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
              <Input id='endDate' type='date' {...register('endDate')} className='bg-slate-900 border-slate-800' />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              {...register('description')}
              placeholder='Activities, achievements, etc.'
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
        <h3 className='text-lg font-medium text-white'>Education</h3>
        <Button onClick={startAdd} size='sm' className='gap-2'>
          <Plus className='h-4 w-4' /> Add Education
        </Button>
      </div>

      <div className='space-y-3'>
        {educations.map((edu, index) => (
          <div
            key={edu.id || index}
            className='bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex justify-between group'
          >
            <div className='flex gap-3'>
              <div className='h-10 w-10 mt-1 bg-slate-800 rounded flex items-center justify-center shrink-0'>
                <GraduationCap className='h-5 w-5 text-blue-400' />
              </div>
              <div>
                <h4 className='font-bold text-white'>{edu.school}</h4>
                <p className='text-sm text-slate-300'>
                  {edu.degree}
                  {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                </p>
                <p className='text-xs text-slate-500 mt-1'>
                  {edu.startDate && format(new Date(edu.startDate), 'yyyy')} -{' '}
                  {edu.endDate ? format(new Date(edu.endDate), 'yyyy') : 'Present'}
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
        {educations.length === 0 && (
          <p className='text-center py-8 text-slate-500 text-sm'>
            No education listed. Share your academic background.
          </p>
        )}
      </div>
    </div>
  );
}
