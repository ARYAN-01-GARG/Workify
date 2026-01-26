'use client';

import { useOptimistic, useState, startTransition } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Trash2, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useToggleCommentLike, useDeleteComment } from '@/hooks/use-comments';
import { CreateCommentForm } from './create-comment-form';
import type { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  depth?: number;
}

export function CommentItem({ comment, postId, depth = 0 }: CommentItemProps) {
  const { data: session } = useSession();

  const [isReplying, setIsReplying] = useState(false);

  // Optimistic like state
  const [optimisticLike, setOptimisticLike] = useOptimistic(
    {
      isLiked: comment.hasLiked ?? comment.likedByCurrentUser ?? false,
      count: comment._count.likes,
    },
    (state, newIsLiked: boolean) => ({
      isLiked: newIsLiked,
      count: newIsLiked ? state.count + 1 : state.count - 1,
    }),
  );

  const { mutate: toggleLike, isPending: isLikeLoading } = useToggleCommentLike();
  const { mutate: deleteComment } = useDeleteComment();

  const isAuthor = session?.user?.id === comment.author.id;

  const handleLike = () => {
    if (isLikeLoading) return;

    // Toggle optimistic state
    const newIsLiked = !optimisticLike.isLiked;
    startTransition(() => {
      setOptimisticLike(newIsLiked);
    });

    toggleLike(comment.id, {
      onError: () => {
        toast.error('Failed to update like');
        // Optimistic hook automatically reverts on next render if we don't update key,
        // but here we just show error. React 19 handles the rest if specific key updates.
      },
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteComment(comment.id, {
        onSuccess: () => {
          toast.success('Comment deleted');
        },
        onError: () => {
          toast.error('Failed to delete comment');
        },
      });
    }
  };

  return (
    <div className={`group flex gap-3 ${depth > 0 ? 'mt-4' : 'py-3'}`}>
      <Link href={`/profile/${comment.author.id}`}>
        <Avatar className='h-8 w-8 mt-1 cursor-pointer'>
          <AvatarImage src={comment.author.avatarUrl || ''} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>

      <div className='flex-1 min-w-0'>
        <div className='bg-slate-900/50 rounded-xl p-3 border border-slate-800/50'>
          <div className='flex items-center justify-between gap-2 mb-1'>
            <div className='flex items-center gap-2'>
              <Link href={`/profile/${comment.author.id}`}>
                <span className='font-semibold text-sm text-slate-200 hover:text-violet-400 cursor-pointer transition-colors'>
                  {comment.author.name}
                </span>
              </Link>
              <span className='text-xs text-slate-500'>
                {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ''}
              </span>
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <MoreHorizontal className='h-4 w-4 text-slate-500' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='bg-slate-900 border-slate-800'>
                  <DropdownMenuItem
                    className='text-red-400 focus:text-red-400 focus:bg-red-900/10 cursor-pointer'
                    onClick={handleDelete}
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className='text-sm text-slate-300 break-words whitespace-pre-wrap'>{comment.content}</p>
        </div>

        <div className='flex items-center gap-4 mt-1 pl-2'>
          <button
            onClick={handleLike}
            disabled={isLikeLoading}
            className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
              optimisticLike.isLiked ? 'text-pink-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Heart className={`h-3 w-3 ${optimisticLike.isLiked ? 'fill-current' : ''}`} />
            {optimisticLike.count > 0 ? optimisticLike.count : 'Like'}
          </button>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className='text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors'
          >
            Reply
          </button>
        </div>

        {isReplying && (
          <div className='mt-3'>
            <CreateCommentForm postId={postId} parentId={comment.id} onSuccess={() => setIsReplying(false)} autoFocus />
          </div>
        )}

        {/* Recursive replies would go here, but for simplicity we assume flat or 1-level deep for now unless we implement full recursion */}
        {comment.replies && comment.replies.length > 0 && (
          <div className='mt-2 pl-4 border-l-2 border-slate-800'>
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
