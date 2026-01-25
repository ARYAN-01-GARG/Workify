'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Image, X, Loader2, Link as LinkIcon, Camera, Video, Calendar, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Textarea } from '@repo/ui/components/textarea';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useCreatePost } from '@/hooks/use-posts';

const createPostSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty'),
  mediaUrls: z.array(z.string()).optional(),
});

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { data: session } = useSession();
  const { mutate: createPost, isPending: isLoading } = useCreatePost();
  const user = session?.user;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        setPreviewUrl(null);
        toast.success('Post created successfully!');
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error('Failed to create post');
        console.error(error);
      },
    });
  };

  const handleMediaUpload = () => {
    // In a real app, this would trigger a file picker
    const mockUrl = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2940&auto=format&fit=crop';
    form.setValue('mediaUrls', [mockUrl]);
    setPreviewUrl(mockUrl);
  };

  const removeMedia = () => {
    form.setValue('mediaUrls', []);
    setPreviewUrl(null);
  };

  if (!user) return null;

  return (
    <div className='pt-2'>
      <div className='flex gap-4 mb-6'>
        <Avatar className='h-12 w-12 border-2 border-slate-700'>
          <AvatarImage src={user.avatarUrl!} alt={user.name!} />
          <AvatarFallback className='bg-slate-800 text-white font-bold'>{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col justify-center'>
          <h3 className='font-bold text-lg text-white'>{user.name}</h3>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-6 text-xs border-slate-700 bg-slate-900/50 text-slate-400 w-fit gap-1 px-2 hover:bg-slate-800 hover:text-white'
          >
            <span className='h-1.5 w-1.5 rounded-full bg-green-500'></span>
            Anyone
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='min-h-[200px]'>
          <Textarea
            {...form.register('content')}
            placeholder='What do you want to talk about?'
            className='bg-transparent border-none text-slate-200 placeholder:text-slate-500 text-lg resize-none min-h-[150px] focus-visible:ring-0 p-0'
          />

          {previewUrl && (
            <div className='relative mt-4 rounded-xl overflow-hidden border border-slate-700 group'>
              <img src={previewUrl} alt='Preview' className='w-full h-auto max-h-[400px] object-cover' />
              <Button
                type='button'
                variant='destructive'
                size='icon'
                className='absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                onClick={removeMedia}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          )}
        </div>

        <div className='flex items-center justify-between pt-4 border-t border-slate-800'>
          <div className='flex gap-1'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-full h-10 w-10 transition-colors'
              onClick={handleMediaUpload}
            >
              <Image className='h-5 w-5' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-slate-400 hover:text-violet-400 hover:bg-violet-400/10 rounded-full h-10 w-10 transition-colors'
            >
              <Video className='h-5 w-5' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-slate-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-full h-10 w-10 transition-colors'
            >
              <Calendar className='h-5 w-5' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-slate-400 hover:text-pink-400 hover:bg-pink-400/10 rounded-full h-10 w-10 transition-colors'
            >
              <Camera className='h-5 w-5' />
            </Button>
            <div className='w-px h-6 bg-slate-800 mx-1 self-center'></div>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-full h-10 w-10 transition-colors'
            >
              <LinkIcon className='h-5 w-5' />
            </Button>
          </div>

          <Button
            type='submit'
            className='bg-violet-600 hover:bg-violet-700 text-white gap-2 px-6 rounded-full font-bold shadow-lg shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
            disabled={isLoading || !form.formState.isDirty}
          >
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Send className='h-4 w-4' />}
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}
