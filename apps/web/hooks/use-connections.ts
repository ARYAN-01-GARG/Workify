'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConnectionService } from '@/services/connection.service';
import { ConnectionStatus } from '@/types/connection';
import type { Connection, SendConnectionRequestDto } from '@/types';

/**
 * Query key factory for connections - ensures consistent cache keys
 */
export const connectionKeys = {
  all: ['connections'] as const,
  lists: () => [...connectionKeys.all, 'list'] as const,
  accepted: () => [...connectionKeys.lists(), 'accepted'] as const,
  pending: () => [...connectionKeys.lists(), 'pending'] as const,
};

/**
 * Fetch all accepted connections for current user
 */
export function useConnections() {
  return useQuery<Connection[]>({
    queryKey: connectionKeys.accepted(),
    queryFn: () => ConnectionService.getConnections(),
  });
}

/**
 * Fetch pending connection requests received by current user
 */
export function usePendingConnections() {
  return useQuery<Connection[]>({
    queryKey: connectionKeys.pending(),
    queryFn: () => ConnectionService.getPendingRequests(),
  });
}

/**
 * Send a connection request to another user
 */
export function useSendConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendConnectionRequestDto) => ConnectionService.sendRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.lists() });
    },
    onError: (error) => {
      console.error('[useSendConnectionRequest] Failed:', error);
    },
  });
}

/**
 * Accept a connection request
 */
export function useAcceptConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) =>
      ConnectionService.updateStatus(connectionId, { status: ConnectionStatus.ACCEPTED }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.lists() });
    },
    onError: (error) => {
      console.error('[useAcceptConnection] Failed:', error);
    },
  });
}

/**
 * Reject a connection request
 */
export function useRejectConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) =>
      ConnectionService.updateStatus(connectionId, { status: ConnectionStatus.REJECTED }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.lists() });
    },
    onError: (error) => {
      console.error('[useRejectConnection] Failed:', error);
    },
  });
}

/**
 * Cancel a pending connection request (sender only)
 */
export function useCancelConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) => ConnectionService.cancelRequest(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.lists() });
    },
    onError: (error) => {
      console.error('[useCancelConnectionRequest] Failed:', error);
    },
  });
}

/**
 * Remove an existing connection
 */
export function useRemoveConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) => ConnectionService.removeConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.lists() });
    },
    onError: (error) => {
      console.error('[useRemoveConnection] Failed:', error);
    },
  });
}
