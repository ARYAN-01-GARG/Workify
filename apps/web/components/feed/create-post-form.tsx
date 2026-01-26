'use client';

import { useState, useRef } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Image as ImageIcon, X, Loader2, Link as LinkIcon, Video, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Textarea } from '@repo/ui/components/textarea';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useCreatePost } from '@/hooks/use-posts';
import { UploadService } from '@/services/upload.service';
import type { CreatePostDto } from '@/types';

const createPostSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty').max(3000, 'Post content is too long'),
  mediaUrls: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

// Custom resolver for zod v4 compatibility
const zodFormResolver: Resolver<CreatePostFormData> = async (values) => {
  const result = createPostSchema.safeParse(values);
  if (result.success) {
    return { values: result.data, errors: {} };
  }
  return {
    values: {},
    errors: Object.fromEntries(
      result.error.issues.map((issue) => [issue.path.join('.'), { type: 'validation', message: issue.message }]),
    ),
  };
};

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { data: session } = useSession();
  const { mutate: createPost, isPending: isLoading } = useCreatePost();
  const user = session?.user;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreatePostFormData>({
    resolver: zodFormResolver,
    defaultValues: {
      content: '',
      mediaUrls: [],
      tags: [],
    },
  });

  const onSubmit = (data: CreatePostFormData): void => {
    const postData: CreatePostDto = {
      content: data.content,
      mediaUrls: data.mediaUrls,
      tags: data.tags,
    };

    createPost(postData, {
      onSuccess: () => {
        form.reset();
        setPreviewUrl(null);
        toast.success('Post created successfully!');
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to create post');
      },
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await UploadService.uploadFile(file, 'posts');
      form.setValue('mediaUrls', [result.url]);
      setPreviewUrl(result.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleMediaUpload = (): void => {
    fileInputRef.current?.click();
  };

  const handleAddMediaUrl = (): void => {
    const url = prompt('Enter image URL:');
    if (url) {
      try {
        new URL(url); // Validate URL
        form.setValue('mediaUrls', [url]);
        setPreviewUrl(url);
      } catch {
        toast.error('Please enter a valid URL');
      }
    }
  };

  const removeMedia = (): void => {
    form.setValue('mediaUrls', []);
    setPreviewUrl(null);
  };

  if (!user) return null;

  const content = form.watch('content');
  const hasContent = content.trim().length > 0;
  const isSubmitDisabled = isLoading || isUploading || !hasContent;

  return (
    <div className='pt-2'>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/jpeg,image/png,image/gif,image/webp'
        onChange={handleFileSelect}
        className='hidden'
      />

      <div className='flex gap-4 mb-4 items-center'>
        <Avatar className='h-12 w-12 border-2 border-slate-700'>
          <AvatarImage src={user.avatarUrl || ''} alt={user.name || 'User'} />
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
            className='bg-transparent border-none text-slate-200 placeholder:text-slate-500 text-lg resize-none min-h-[120px] focus-visible:ring-0 p-0'
          />
          {form.formState.errors.content && (
            <p className='text-sm text-red-400 mt-2'>{form.formState.errors.content.message}</p>
          )}

          {isUploading && (
            <div className='mt-4 flex items-center justify-center py-8 border border-dashed border-slate-700 rounded-xl bg-slate-900/50'>
              <div className='flex items-center gap-3 text-slate-400'>
                <Loader2 className='h-5 w-5 animate-spin' />
                <span>Uploading image...</span>
              </div>
            </div>
          )}

          {previewUrl && !isUploading ? (
            <div className='relative mt-4 rounded-xl overflow-hidden border border-slate-700 group'>
              <Image
                src={previewUrl}
                alt='Preview'
                width={500}
                height={300}
                className='w-full h-auto max-h-[400px] object-cover'
                unoptimized
              />
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
          ) : null}
        </div>

        <div className='flex items-center justify-between pt-2'>
          <div className='flex gap-1'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-full h-10 w-10 transition-colors'
              onClick={handleMediaUpload}
              disabled={isUploading}
              title='Upload image'
            >
              {isUploading ? <Loader2 className='h-5 w-5 animate-spin' /> : <ImageIcon className='h-5 w-5' />}
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-slate-400 hover:text-violet-400 hover:bg-violet-400/10 rounded-full h-10 w-10 transition-colors'
              onClick={() => toast.info('Video upload coming soon!')}
              title='Upload video'
            >
              <Video className='h-5 w-5' />
            </Button>
            <div className='w-px h-6 bg-slate-800 mx-1 self-center'></div>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-full h-10 w-10 transition-colors'
              onClick={handleAddMediaUrl}
              title='Add image URL'
            >
              <LinkIcon className='h-5 w-5' />
            </Button>
          </div>

          <Button
            type='submit'
            className='bg-violet-600 hover:bg-violet-700 text-white gap-2 px-6 rounded-full font-bold shadow-lg shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
            disabled={isSubmitDisabled}
          >
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Send className='h-4 w-4' />}
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}
