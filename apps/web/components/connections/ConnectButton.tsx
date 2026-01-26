'use client';

import { useState } from 'react';
import { UserPlus, UserCheck, Loader2, UserX } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { toast } from 'sonner';
import { useSendConnectionRequest, useCancelConnectionRequest } from '@/hooks/use-connections';

interface ConnectButtonProps {
  userId: string;
  connectionStatus?: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'CONNECTED';
  connectionId?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

/**
 * A button component that manages connection requests between users.
 * Displays different states: Connect, Pending, Connected, or Respond based on the connection status.
 *
 * @param userId - The ID of the user to connect with
 * @param connectionStatus - Current connection status with the user
 * @param connectionId - ID of the existing connection (required for cancel/remove actions)
 * @param className - Additional CSS classes to apply to the button
 * @param size - Button size variant
 */
export function ConnectButton({
  userId,
  connectionStatus = 'NONE',
  connectionId,
  className,
  size = 'default',
}: ConnectButtonProps) {
  const [status, setStatus] = useState(connectionStatus);

  const { mutate: sendRequest, isPending: isSending } = useSendConnectionRequest();
  const { mutate: cancelRequest, isPending: isCancelling } = useCancelConnectionRequest();

  const handleConnect = (): void => {
    sendRequest(
      { receiverId: userId },
      {
        onSuccess: () => {
          setStatus('PENDING_SENT');
          toast.success('Connection request sent!');
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Failed to send request');
        },
      },
    );
  };

  const handleCancel = (): void => {
    if (!connectionId) {
      toast.error('Connection ID not found. Please refresh the page.');
      return;
    }
    cancelRequest(connectionId, {
      onSuccess: () => {
        setStatus('NONE');
        toast.success('Connection request cancelled');
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to cancel request');
      },
    });
  };

  const isLoading = isSending || isCancelling;

  if (status === 'CONNECTED') {
    return (
      <Button variant='outline' size={size} className={className} disabled>
        <UserCheck className='h-4 w-4 mr-2' />
        Connected
      </Button>
    );
  }

  if (status === 'PENDING_SENT') {
    return (
      <Button variant='outline' size={size} className={className} onClick={handleCancel} disabled={isLoading}>
        {isLoading ? <Loader2 className='h-4 w-4 mr-2 animate-spin' /> : <UserX className='h-4 w-4 mr-2' />}
        Pending
      </Button>
    );
  }

  if (status === 'PENDING_RECEIVED') {
    return (
      <Button variant='default' size={size} className={className} disabled>
        <UserCheck className='h-4 w-4 mr-2' />
        Respond
      </Button>
    );
  }

  return (
    <Button
      variant='default'
      size={size}
      className={`bg-violet-600 hover:bg-violet-700 ${className}`}
      onClick={handleConnect}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className='h-4 w-4 mr-2 animate-spin' /> : <UserPlus className='h-4 w-4 mr-2' />}
      Connect
    </Button>
  );
}
