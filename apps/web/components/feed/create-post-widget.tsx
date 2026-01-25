'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Image, Send, Loader2, Link as LinkIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useCreatePost } from '@/hooks/use-posts';

const createPostSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty'),
  mediaUrls: z.array(z.string()).optional(),
});

interface CreatePostWidgetProps {
  onPostCreated?: () => void;
}

export function CreatePostWidget({ onPostCreated }: CreatePostWidgetProps) {
  const { data: session } = useSession();
  const { mutate: createPost, isPending: isLoading } = useCreatePost();
  const user = session?.user;

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema as any),
    defaultValues: {
      content: '',
      mediaUrls: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof createPostSchema>) => {
    createPost(data, {
      onSuccess: () => {
        form.reset();
        toast.success('Post created successfully!');
        onPostCreated?.();
      },
      onError: (error: any) => {
        toast.error('Failed to create post');
        console.error(error);
      },
    });
  };

  if (!user) return null;

  return (
    <Card className='bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-6 overflow-hidden'>
      <CardContent className='p-4 sm:p-5'>
        <div className='flex gap-4'>
          <Avatar className='h-11 w-11 border-2 border-slate-800 shrink-0'>
            <AvatarImage src={user.avatarUrl!} alt={user.name!} />
            <AvatarFallback className='bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold'>
              {user.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>

          <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 space-y-4'>
            <div className='relative group'>
              <Input
                {...form.register('content')}
                placeholder='Start a post...'
                className='bg-slate-950/50 border-slate-700/50 text-white placeholder:text-slate-500 rounded-2xl h-14 px-5 focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50 transition-all duration-300 hover:bg-slate-950 group-hover:border-slate-600'
              />
            </div>

            <div className='flex items-center justify-between pl-1'>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 gap-2 h-9 rounded-lg transition-colors'
                >
                  <Image className='h-4.5 w-4.5' />
                  <span className='hidden sm:inline font-medium'>Media</span>
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='text-slate-400 hover:text-green-400 hover:bg-green-400/10 gap-2 h-9 rounded-lg transition-colors'
                >
                  <LinkIcon className='h-4.5 w-4.5' />
                  <span className='hidden sm:inline font-medium'>Link</span>
                </Button>
              </div>

              <Button
                type='submit'
                size='sm'
                className='bg-white text-slate-950 hover:bg-slate-200 gap-2 px-6 rounded-full font-bold shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                disabled={isLoading || !form.formState.isDirty}
              >
                {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Send className='h-4 w-4' />}
                Post
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
