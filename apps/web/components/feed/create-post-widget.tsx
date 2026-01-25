'use client';

import { useState } from 'react';
import { Image, Calendar, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/dialog';
import { CreatePostForm } from './create-post-form';

interface CreatePostWidgetProps {
  onPostCreated?: () => void;
}

export function CreatePostWidget({ onPostCreated }: CreatePostWidgetProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <Card className='bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-6 overflow-hidden'>
      <CardContent className='p-4 sm:p-5'>
        <div className='flex gap-4 items-center'>
          <Avatar className='h-12 w-12 border-2 border-slate-800 shrink-0 cursor-pointer hover:border-violet-500/50 transition-colors'>
            <AvatarImage src={user.avatarUrl!} alt={user.name!} />
            <AvatarFallback className='bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold'>
              {user.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div className='flex-1 cursor-pointer'>
                <div className='bg-slate-950/50 border border-slate-700/50 text-slate-400 rounded-full h-12 px-5 flex items-center hover:bg-slate-900 hover:border-slate-600 hover:text-slate-300 transition-all duration-200 group'>
                  <span className='font-medium'>Start a post, {user.name?.split(' ')[0]}...</span>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[600px] bg-slate-950 border-slate-800 text-slate-200 p-0 overflow-hidden gap-0'>
              <DialogHeader className='p-4 border-b border-slate-800 flex flex-row items-center justify-between space-y-0'>
                <DialogTitle className='text-lg font-semibold text-white'>Create a post</DialogTitle>
              </DialogHeader>
              <div className='p-4'>
                <CreatePostForm
                  onSuccess={() => {
                    setOpen(false);
                    onPostCreated?.();
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className='flex items-center justify-between pt-3 mt-3 border-t border-slate-800/50 px-2'>
          <Button
            variant='ghost'
            size='sm'
            className='text-slate-400 hover:text-blue-400 gap-2 h-9 rounded-lg transition-colors flex-1'
            onClick={() => setOpen(true)}
          >
            <Image className='h-5 w-5 text-blue-500/80' />
            <span className='font-medium text-xs sm:text-sm'>Media</span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='text-slate-400 hover:text-orange-400 gap-2 h-9 rounded-lg transition-colors flex-1'
            onClick={() => setOpen(true)}
          >
            <Calendar className='h-5 w-5 text-orange-500/80' />
            <span className='font-medium text-xs sm:text-sm'>Event</span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='text-slate-400 hover:text-pink-400 gap-2 h-9 rounded-lg transition-colors flex-1'
            onClick={() => setOpen(true)}
          >
            <Briefcase className='h-5 w-5 text-pink-500/80' />
            <span className='font-medium text-xs sm:text-sm'>Job</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
