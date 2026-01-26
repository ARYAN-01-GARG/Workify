'use client';

import { Fragment } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { useComments } from '@/hooks/use-comments';
import { CommentItem } from './comment-item';

interface CommentListProps {
    postId: string;
}

export function CommentList({ postId }: CommentListProps) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useComments(postId);

    if (isLoading) {
        return (
            <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 text-slate-500 animate-spin" />
            </div>
        );
    }

    // Check for items existence in the first page
    if (!data?.pages[0]?.data?.length) {
        return (
            <div className="text-center py-6">
                <p className="text-slate-500 text-sm">No comments yet. Be the first to shout out!</p>
            </div>
        );
    }

    return (
        <div className="space-y-0">
            {data.pages.map((page, i) => (
                <Fragment key={i}>
                    {page.data.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} postId={postId} />
                    ))}
                </Fragment>
            ))}

            {hasNextPage && (
                <div className="pt-2 flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="text-slate-400 hover:text-slate-200"
                    >
                        {isFetchingNextPage ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Load more comments
                    </Button>
                </div>
            )}
        </div>
    );
}
