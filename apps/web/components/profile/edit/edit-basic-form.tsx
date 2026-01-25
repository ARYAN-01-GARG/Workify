'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Textarea } from '@repo/ui/components/textarea';
import { Label } from '@repo/ui/components/label';
import { UserProfile } from '@/hooks/use-profile';
import { UserService } from '@/services/user.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface BasicFormData {
  name: string;
  bio: string;
  about: string;
}

interface EditBasicFormProps {
  user: UserProfile;
  onSuccess: () => void;
}

export function EditBasicForm({ user, onSuccess }: EditBasicFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicFormData>({
    defaultValues: {
      name: user.name || '',
      bio: user.bio || '',
      about: user.about || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: BasicFormData) => UserService.updateCandidateProfile(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
      onSuccess();
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const onSubmit = (data: BasicFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Full Name</Label>
        <Input
          id='name'
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
          className='bg-slate-900 border-slate-800'
        />
        {errors.name && <p className='text-sm text-red-400'>{errors.name.message}</p>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='bio'>Short Bio (Tagline)</Label>
        <Input
          id='bio'
          {...register('bio', { maxLength: { value: 160, message: 'Bio must be less than 160 characters' } })}
          placeholder='Building great products...'
          className='bg-slate-900 border-slate-800'
        />
        {errors.bio && <p className='text-sm text-red-400'>{errors.bio.message}</p>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='about'>About</Label>
        <Textarea
          id='about'
          {...register('about')}
          placeholder='Tell others about yourself...'
          className='bg-slate-900 border-slate-800 min-h-[150px]'
        />
      </div>

      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
