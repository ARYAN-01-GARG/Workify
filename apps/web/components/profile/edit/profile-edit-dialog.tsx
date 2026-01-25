'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/components/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { UserProfile } from '@/hooks/use-profile';
import { EditBasicForm } from './edit-basic-form';
import { EditExperienceForm } from './edit-experience-form';
import { EditEducationForm } from './edit-education-form';
import { EditSkillsForm } from './edit-skills-form';

interface ProfileEditDialogProps {
  user: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: string;
}

export function ProfileEditDialog({ user, open, onOpenChange, defaultTab = 'basic' }: ProfileEditDialogProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Update active tab when defaultTab changes (e.g. opening different section)
  React.useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800 text-slate-200'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='bg-slate-900 border-slate-800'>
            <TabsTrigger value='basic'>Basic Info</TabsTrigger>
            <TabsTrigger value='experience'>Experience</TabsTrigger>
            <TabsTrigger value='education'>Education</TabsTrigger>
            <TabsTrigger value='skills'>Skills</TabsTrigger>
          </TabsList>

          <TabsContent value='basic' className='mt-6'>
            <EditBasicForm user={user} onSuccess={() => onOpenChange(false)} />
          </TabsContent>

          <TabsContent value='experience' className='mt-6'>
            <EditExperienceForm user={user} />
          </TabsContent>

          <TabsContent value='education' className='mt-6'>
            <EditEducationForm user={user} />
          </TabsContent>

          <TabsContent value='skills' className='mt-6'>
            <EditSkillsForm user={user} onSuccess={() => onOpenChange(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
