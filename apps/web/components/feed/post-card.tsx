'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader } from '@repo/ui/components/card';
import { toast } from 'sonner';
import { useToggleLike } from '@/hooks/use-posts';

export interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
    headline?: string | null;
    role?: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  hasLiked?: boolean;
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.hasLiked ?? false);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const { mutate: toggleLike, isPending: isLikeLoading } = useToggleLike();

  const handleLike = () => {
    if (isLikeLoading) return;

    // Optimistic update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    toggleLike(post.id, {
      onError: () => {
        // Revert on error
        setIsLiked(!newIsLiked);
        setLikeCount((prev) => (!newIsLiked ? prev + 1 : prev - 1));
        toast.error('Failed to update like');
      },
    });
  };

  return (
    <Card className='bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-6 overflow-hidden hover:border-slate-700/80 transition-all duration-300 shadow-sm hover:shadow-md'>
      <CardHeader className='flex flex-row items-start gap-4 p-5 pb-3'>
        <Avatar className='h-12 w-12 border-2 border-slate-800 cursor-pointer hover:border-violet-500/50 transition-colors'>
          <AvatarImage src={post.author.image || ''} alt={post.author.name} />
          <AvatarFallback className='bg-slate-800 text-slate-300 font-bold'>
            {post.author.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className='flex-1 min-w-0 pt-1'>
          <div className='flex items-start justify-between'>
            <div>
              <h3 className='text-base font-bold text-white hover:text-violet-400 cursor-pointer truncate transition-colors'>
                {post.author.name}
              </h3>
              <p className='text-sm text-slate-400 truncate'>{post.author.headline || post.author.role || 'Member'}</p>
              <p className='text-xs text-slate-500 mt-1'>
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
            <Button variant='ghost' size='icon' className='text-slate-500 hover:text-white -mr-2 -mt-2'>
              <MoreHorizontal className='h-5 w-5' />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-5 pt-2'>
        <p className='text-[15px] leading-relaxed text-slate-200 whitespace-pre-wrap mb-4'>{post.content}</p>

        {post.mediaUrls.length > 0 && (
          <div className='rounded-xl overflow-hidden border border-slate-800 mt-3 group cursor-pointer'>
            <img
              src={post.mediaUrls[0]}
              alt='Post content'
              className='w-full h-auto max-h-[600px] object-cover group-hover:scale-[1.01] transition-transform duration-500'
            />
          </div>
        )}
      </CardContent>

      <CardFooter className='px-2 py-1 border-t border-slate-800/50 flex items-center justify-between bg-slate-950/20'>
        <div className='flex gap-1 w-full'>
          <Button
            variant='ghost'
            size='sm'
            className={`flex-1 gap-2 h-10 rounded-lg transition-colors ${isLiked ? 'text-pink-500 bg-pink-500/10 hover:bg-pink-500/20 hover:text-pink-600' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            onClick={handleLike}
          >
            <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-current' : ''}`} />
            <span className='text-sm font-medium'>{likeCount > 0 ? likeCount : 'Like'}</span>
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='flex-1 gap-2 h-10 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors'
          >
            <MessageCircle className='h-4.5 w-4.5' />
            <span className='text-sm font-medium'>{post._count.comments > 0 ? post._count.comments : 'Comment'}</span>
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='flex-1 gap-2 h-10 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors'
          >
            <Share2 className='h-4.5 w-4.5' />
            <span className='text-sm font-medium'>Share</span>
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='flex-1 gap-2 h-10 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors'
          >
            <Send className='h-4.5 w-4.5' />
            <span className='text-sm font-medium'>Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
