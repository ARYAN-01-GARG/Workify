import { useRef, useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { MessageCircle, UserMinus, Loader2 } from 'lucide-react';
import { useRemoveConnection } from '@/hooks/use-connections';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog';
import type { Connection, ConnectionUser } from '@/types';

interface ConnectionCardProps {
  connection: Connection;
  currentUserId: string;
}

export function ConnectionCard({ connection, currentUserId }: ConnectionCardProps) {
  const { mutate: removeConnection, isPending: isRemoving } = useRemoveConnection();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  // Determine who the "other" user is
  const otherUser: ConnectionUser | undefined =
    connection.senderId === currentUserId ? connection.receiver : connection.sender;

  if (!otherUser) return null;

  const handleRemove = () => {
    removeConnection(connection.id, {
      onSuccess: () => {
        toast.success('Connection removed');
        setShowRemoveDialog(false);
      },
      onError: (error) => {
        toast.error('Failed to remove connection');
      },
    });
  };

  return (
    <>
      <Card className='bg-slate-900/40 border-slate-800 backdrop-blur-sm hover:border-violet-500/30 transition-all duration-300 group'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-4'>
            <Link href={`/profile/${otherUser.id}`}>
              <Avatar className='h-12 w-12 sm:h-14 sm:w-14 border-2 border-slate-800 group-hover:border-violet-500/50 transition-colors cursor-pointer'>
                <AvatarImage src={otherUser.avatarUrl || ''} alt={otherUser.name} />
                <AvatarFallback className='bg-slate-800 text-white font-bold'>
                  {otherUser.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div className='flex-1 min-w-0'>
              <Link href={`/profile/${otherUser.id}`}>
                <h3 className='font-semibold text-white group-hover:text-violet-400 transition-colors truncate'>
                  {otherUser.name}
                </h3>
              </Link>
              <p className='text-sm text-slate-400 truncate'>{otherUser.bio || 'No bio available'}</p>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                className='h-9 w-9 p-0 rounded-full bg-slate-800/50 hover:bg-violet-500/20 text-slate-300 hover:text-violet-300 border border-slate-700/50 hover:border-violet-500/50'
                title='Message'
              >
                <MessageCircle className='h-4 w-4' />
                <span className='sr-only'>Message</span>
              </Button>

              <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-9 w-9 p-0 rounded-full bg-slate-800/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700/50 hover:border-red-500/50'
                    title='Remove Connection'
                  >
                    <UserMinus className='h-4 w-4' />
                    <span className='sr-only'>Remove</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='bg-slate-950 border-slate-800 text-slate-200'>
                  <AlertDialogHeader>
                    <AlertDialogTitle className='text-white'>Remove Connection?</AlertDialogTitle>
                    <AlertDialogDescription className='text-slate-400'>
                      Are you sure you want to remove <strong>{otherUser.name}</strong> from your connections?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className='bg-slate-900 border-slate-700 text-white hover:bg-slate-800 hover:text-white'>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove();
                      }}
                      className='bg-red-600 hover:bg-red-700 text-white focus:ring-red-600'
                      disabled={isRemoving}
                    >
                      {isRemoving ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : null}
                      {isRemoving ? 'Removing...' : 'Remove'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
