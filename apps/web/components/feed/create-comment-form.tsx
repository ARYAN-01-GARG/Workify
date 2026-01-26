'use client';

import { useForm, Resolver } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { useSession } from 'next-auth/react';
import { useCreateComment } from '@/hooks/use-comments';
import { toast } from 'sonner';

const schema = z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment too long'),
});

type FormData = z.infer<typeof schema>;

interface CreateCommentFormProps {
    postId: string;
    parentId?: string;
    onSuccess?: () => void;
    autoFocus?: boolean;
}

// Custom resolver for zod v4 compatibility
const zodFormResolver: Resolver<FormData> = async (values) => {
    const result = schema.safeParse(values);
    if (result.success) {
        return { values: result.data, errors: {} };
    }
    return {
        values: {},
        errors: Object.fromEntries(
            result.error.issues.map((issue) => [
                issue.path.join('.'),
                { type: 'validation', message: issue.message },
            ])
        ),
    };
};

export function CreateCommentForm({ postId, parentId, onSuccess, autoFocus }: CreateCommentFormProps) {
    const { data: session } = useSession();
    const user = session?.user;
    const { mutate: createComment, isPending } = useCreateComment();

    const form = useForm<FormData>({
        resolver: zodFormResolver,
        defaultValues: { content: '' },
    });

    const onSubmit = (data: FormData) => {
        createComment(
            {
                postId,
                dto: { content: data.content, parentId },
            },
            {
                onSuccess: () => {
                    form.reset();
                    onSuccess?.();
                },
                onError: () => {
                    toast.error('Failed to post comment');
                },
            }
        );
    };

    if (!user) return null;

    return (
        <div className="flex gap-3">
            <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={user.avatarUrl || ''} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
                <div className="relative">
                    <input
                        {...form.register('content')}
                        placeholder={parentId ? "Write a reply..." : "Add a comment..."}
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-full py-2 px-4 pr-12 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        autoFocus={autoFocus}
                        disabled={isPending}
                        autoComplete="off"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        disabled={!form.watch('content')?.trim() || isPending}
                        className="absolute right-1 top-1 h-7 w-7 rounded-full text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-3 w-3" />}
                    </Button>
                </div>
            </form>
        </div>
    );
}
