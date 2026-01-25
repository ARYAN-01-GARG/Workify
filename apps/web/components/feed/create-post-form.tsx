'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Image, X, Loader2, Link as LinkIcon, Video, Send } from 'lucide-react';
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

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2787&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2940&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2940&auto=format&fit=crop',
];

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
    // For now we just pick the first mock image if none selected
    const mockUrl = MOCK_IMAGES[1] || '';
    form.setValue('mediaUrls', [mockUrl]);
    setPreviewUrl(mockUrl);
  };

  const handleSelectMockImage = (url: string) => {
    form.setValue('mediaUrls', [url]);
    setPreviewUrl(url);
  };

  const removeMedia = () => {
    form.setValue('mediaUrls', []);
    setPreviewUrl(null);
  };

  if (!user) return null;

  return (
    <div className='pt-2'>
      <div className='flex gap-4 mb-4 items-center'>
        <Avatar className='h-12 w-12 border-2 border-slate-700'>
          <AvatarImage src={user.avatarUrl!} alt={user.name!} />
          <AvatarFallback className='bg-slate-800 text-white font-bold'>{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col justify-center'>
          <h3 className='font-bold text-lg text-white'>{user.name}</h3>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='min-h-[200px] border border-slate-800 rounded-xl bg-slate-900/30 p-4'>
          <Textarea
            {...form.register('content')}
            placeholder='What do you want to talk about?'
            className='bg-transparent border-none p-4 text-slate-200 placeholder:text-slate-500 text-lg resize-none min-h-[120px] focus-visible:ring-0 p-0'
          />

          {previewUrl ? (
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
          ) : (
            <div className='mt-4 flex gap-2 overflow-x-auto pb-2'>
              {MOCK_IMAGES.map((url, index) => (
                <button
                  key={index}
                  type='button'
                  onClick={() => handleSelectMockImage(url)}
                  className='relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-slate-700 hover:border-violet-500 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500'
                >
                  <img src={url} alt={`Gallery ${index + 1}`} className='h-full w-full object-cover' />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='flex items-center justify-between pt-2'>
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
