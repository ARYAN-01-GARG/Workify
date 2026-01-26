'use client';

import { useOptimistic, useState, startTransition } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Trash2, EyeOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader } from '@repo/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui/components/alert-dialog';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@repo/ui/components/dialog';
import { toast } from 'sonner';
import { useToggleLike, useDeletePost } from '@/hooks/use-posts';
import type { Post } from '@/types';
import { CommentList } from './comment-list';
import { CreateCommentForm } from './create-comment-form';
export type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

interface LikeState {
  isLiked: boolean;
  count: number;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // React 19 useOptimistic for instant UI feedback on likes
  const [optimisticLike, setOptimisticLike] = useOptimistic<LikeState, boolean>(
    { isLiked: post.hasLiked ?? false, count: post._count.likes },
    (state, newIsLiked) => ({
      isLiked: newIsLiked,
      count: newIsLiked ? state.count + 1 : state.count - 1,
    }),
  );

  const { mutate: toggleLike, isPending: isLikeLoading } = useToggleLike();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const isAuthor = currentUserId === post.author.id;

  const handleLike = (): void => {
    if (isLikeLoading) return;

    const newIsLiked = !optimisticLike.isLiked;
    startTransition(() => {
      setOptimisticLike(newIsLiked);
    });

    toggleLike(post.id, {
      onError: () => {
        toast.error('Failed to update like');
      },
    });
  };

  const handleDelete = (): void => {
    deletePost(post.id, {
      onSuccess: () => {
        toast.success('Post deleted successfully');
        setShowDeleteDialog(false);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to delete post');
      },
    });
  };

  const handleHide = (): void => {
    toast.info('Post hidden');
  };

  const handleShare = (): void => {
    if (navigator.share) {
      navigator
        .share({
          title: `Post by ${post.author.name}`,
          text: post.content.substring(0, 100),
          url: `${window.location.origin}/posts/${post.id}`,
        })
        .catch(() => {
          // User cancelled or error
        });
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <>
      <Card className='bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-4 overflow-hidden hover:border-slate-700/80 transition-all duration-300 shadow-sm hover:shadow-md'>
        <CardHeader className='flex flex-row items-start gap-4 p-4 pb-2'>
          <Link href={`/profile/${post.author.id}`}>
            <Avatar className='h-10 w-10 border-2 border-slate-800 cursor-pointer hover:border-violet-500/50 transition-colors'>
              <AvatarImage src={post.author.avatarUrl || ''} alt={post.author.name} />
              <AvatarFallback className='bg-slate-800 text-slate-300 font-bold text-xs'>
                {post.author.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className='flex-1 min-w-0 pt-0.5'>
            <div className='flex items-start justify-between'>
              <div>
                <Link href={`/profile/${post.author.id}`}>
                  <h3 className='text-sm font-bold text-white hover:text-violet-400 cursor-pointer truncate transition-colors'>
                    {post.author.name}
                  </h3>
                </Link>
                <p className='text-xs text-slate-400 truncate'>
                  {post.author.headline || post.author.role || 'Member'}
                </p>
                <p className='text-[10px] text-slate-500 mt-0.5'>
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='text-slate-500 hover:text-white -mr-2 -mt-1 h-8 w-8'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='bg-slate-950 border-slate-800'>
                  {isAuthor ? (
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className='text-red-500 focus:text-red-400 focus:bg-red-500/10 cursor-pointer'
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete Post
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={handleHide}
                      className='text-slate-300 focus:text-white focus:bg-slate-800 cursor-pointer'
                    >
                      <EyeOff className='mr-2 h-4 w-4' />
                      Hide Post
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-4 pt-1 pb-3'>
          <div
            className={`relative ${!isExpanded && post.content.length > 200 ? 'cursor-pointer' : ''}`}
            onClick={() => !isExpanded && setIsExpanded(true)}
          >
            <p
              className={`text-sm leading-relaxed text-slate-200 whitespace-pre-wrap mb-3 ${!isExpanded ? 'line-clamp-3' : ''}`}
            >
              {post.content}
            </p>
            {post.content.length > 200 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className='text-sm font-medium text-slate-400 hover:text-white hover:underline mt-1'
              >
                {isExpanded ? 'Show less' : 'See more'}
              </button>
            )}
          </div>

          {post.mediaUrls.length > 0 && (
            <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
              <DialogTrigger asChild>
                <div
                  className='rounded-lg overflow-hidden border border-slate-800 mt-2 group cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImageOpen(true);
                  }}
                >
                  <img
                    src={post.mediaUrls[0]}
                    alt='Post content'
                    className='w-full h-auto max-h-[500px] object-cover group-hover:scale-[1.01] transition-transform duration-500'
                  />
                </div>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[90vw] h-fit max-h-[90vh] p-0 bg-transparent border-none shadow-none overflow-hidden flex items-center justify-center outline-none'>
                <DialogTitle className='sr-only'>Post Image</DialogTitle>
                <div className='relative w-full h-full flex items-center justify-center pointer-events-auto'>
                  <img
                    src={post.mediaUrls[0]}
                    alt='Post content full screen'
                    className='w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain rounded-md'
                  />
                  <button
                    onClick={() => setIsImageOpen(false)}
                    className='absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-colors'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <line x1='18' y1='6' x2='6' y2='18'></line>
                      <line x1='6' y1='6' x2='18' y2='18'></line>
                    </svg>
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>

        <CardFooter className='px-2 py-1 border-t border-slate-800/50 flex items-center justify-between bg-slate-950/20'>
          <div className='flex gap-1 w-full'>
            <Button
              variant='ghost'
              size='sm'
              className={`flex-1 gap-2 h-9 rounded-lg transition-colors ${optimisticLike.isLiked ? 'text-pink-500 bg-pink-500/10 hover:bg-pink-500/20 hover:text-pink-600' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              onClick={handleLike}
              disabled={isLikeLoading}
            >
              <Heart className={`h-4 w-4 ${optimisticLike.isLiked ? 'fill-current' : ''}`} />
              <span className='text-xs font-medium'>{optimisticLike.count > 0 ? optimisticLike.count : 'Like'}</span>
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className={`flex-1 gap-2 h-9 rounded-lg transition-colors ${showComments ? 'text-violet-400 bg-violet-400/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className='h-4 w-4' />
              <span className='text-xs font-medium'>{post._count.comments > 0 ? post._count.comments : 'Comment'}</span>
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='flex-1 gap-2 h-9 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors'
              onClick={handleShare}
            >
              <Share2 className='h-4 w-4' />
              <span className='text-xs font-medium'>Share</span>
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='flex-1 gap-2 h-9 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors'
            >
              <Send className='h-4 w-4' />
              <span className='text-xs font-medium'>Send</span>
            </Button>
          </div>
        </CardFooter>

        {showComments && (
          <div className='bg-slate-950/30 border-t border-slate-800/50 p-4'>
            <CreateCommentForm postId={post.id} autoFocus />
            <div className='mt-6'>
              <CommentList postId={post.id} />
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className='bg-slate-950 border-slate-800'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-white'>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription className='text-slate-400'>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className='bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700 text-white'
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
