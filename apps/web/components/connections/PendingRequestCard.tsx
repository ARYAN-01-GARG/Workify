'use client';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAcceptConnection, useRejectConnection } from '@/hooks/use-connections';
import type { Connection } from '@/types';

interface PendingRequestCardProps {
  connection: Connection;
}

export function PendingRequestCard({ connection }: PendingRequestCardProps) {
  const sender = connection.sender;
  const { mutate: accept, isPending: isAccepting } = useAcceptConnection();
  const { mutate: reject, isPending: isRejecting } = useRejectConnection();

  if (!sender) return null;

  const handleAccept = (): void => {
    accept(connection.id, {
      onSuccess: () => {
        toast.success(`You are now connected with ${sender.name}!`);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to accept request');
      },
    });
  };

  const handleReject = (): void => {
    reject(connection.id, {
      onSuccess: () => {
        toast.success('Connection request declined');
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to decline request');
      },
    });
  };

  const isLoading = isAccepting || isRejecting;

  return (
    <Card className='bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors'>
      <CardContent className='p-4'>
        <div className='flex items-start gap-4'>
          <Link href={`/profile/${sender.id}`}>
            <Avatar className='h-14 w-14 border-2 border-slate-700 hover:border-violet-500 transition-colors cursor-pointer'>
              <AvatarImage src={sender.avatarUrl || ''} alt={sender.name} />
              <AvatarFallback className='bg-slate-800 text-white font-bold'>{sender.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>

          <div className='flex-1 min-w-0'>
            <Link href={`/profile/${sender.id}`}>
              <h3 className='font-semibold text-white hover:text-violet-400 transition-colors truncate'>
                {sender.name}
              </h3>
            </Link>
            {sender.bio && <p className='text-sm text-slate-400 truncate'>{sender.bio}</p>}
            <p className='text-xs text-slate-500 mt-1'>
              Sent{' '}
              {connection.createdAt
                ? formatDistanceToNow(new Date(connection.createdAt), { addSuffix: true })
                : 'recently'}
            </p>
          </div>

          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              className='border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500'
              onClick={handleReject}
              disabled={isLoading}
            >
              {isRejecting ? <Loader2 className='h-4 w-4 animate-spin' /> : <X className='h-4 w-4' />}
            </Button>
            <Button
              size='sm'
              className='bg-green-600 hover:bg-green-700 text-white'
              onClick={handleAccept}
              disabled={isLoading}
            >
              {isAccepting ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <>
                  <Check className='h-4 w-4 mr-1' />
                  Accept
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
