'use client';

import React, { useState, KeyboardEvent } from 'react';
import { UserProfile } from '@/hooks/use-profile';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { X, Plus, Sparkles } from 'lucide-react';
import { UserService } from '@/services/user.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface EditSkillsFormProps {
  user: UserProfile;
  onSuccess: () => void;
}

export function EditSkillsForm({ user, onSuccess }: EditSkillsFormProps) {
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<string[]>(user.candidateProfile?.skills || []);
  const [input, setInput] = useState('');

  const mutation = useMutation({
    mutationFn: (newSkills: string[]) => UserService.updateCandidateProfile({ skills: newSkills }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Skills updated');
      onSuccess();
    },
    onError: () => {
      toast.error('Failed to update skills');
    },
  });

  const addSkill = (skillToAdd?: string) => {
    const skill = (skillToAdd || input).trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = () => {
    mutation.mutate(skills);
  };

  const suggestedSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL'];
  const availableSuggestions = suggestedSkills.filter((s) => !skills.includes(s));

  return (
    <div className='space-y-6'>
      <div>
        <div className='flex items-center gap-2 mb-2'>
          <Sparkles className='h-5 w-5 text-violet-400' />
          <h3 className='text-lg font-medium text-white'>Skills</h3>
        </div>
        <p className='text-sm text-slate-400 mb-4'>Add skills to showcase your expertise. Press Enter or click Add.</p>

        <div className='flex gap-2 mb-4'>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Type a skill and press Enter...'
            className='bg-slate-900 border-slate-800 flex-1'
          />
          <Button type='button' onClick={() => addSkill()} variant='secondary' className='gap-1'>
            <Plus className='h-4 w-4' /> Add
          </Button>
        </div>

        {/* Current Skills */}
        <div className='min-h-[120px] p-4 bg-slate-900/50 rounded-xl border border-slate-800'>
          {skills.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {skills.map((skill) => (
                <div
                  key={skill}
                  className='flex items-center gap-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-200 px-4 py-2 rounded-full border border-violet-500/30 hover:border-violet-400/50 transition-colors'
                >
                  <span className='font-medium'>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className='hover:text-white hover:bg-red-500/30 rounded-full p-0.5 transition-colors'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-full text-slate-500'>
              <Plus className='h-8 w-8 mb-2 opacity-50' />
              <p className='text-sm'>No skills added yet. Start typing above!</p>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {availableSuggestions.length > 0 && (
          <div className='mt-4'>
            <p className='text-xs text-slate-500 mb-2'>Quick add:</p>
            <div className='flex flex-wrap gap-2'>
              {availableSuggestions.slice(0, 5).map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className='text-sm px-3 py-1 rounded-full bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-violet-500/50 hover:text-violet-300 hover:bg-violet-500/10 transition-all'
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='flex justify-end pt-4 border-t border-slate-800'>
        <Button onClick={handleSave} disabled={mutation.isPending} className='gap-2'>
          {mutation.isPending ? 'Saving...' : 'Save Skills'}
        </Button>
      </div>
    </div>
  );
}
