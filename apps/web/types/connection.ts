/**
 * Connection types matching backend API
 */

/**
 * Connection status enum matching @repo/db
 */
export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

/**
 * User summary in connection responses
 */
export interface ConnectionUser {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    bio?: string | null;
}

/**
 * Connection entity from backend
 */
export interface Connection {
    id: string;
    senderId: string;
    receiverId: string;
    status: ConnectionStatus;
    createdAt: string;
    updatedAt: string;
    sender?: ConnectionUser;
    receiver?: ConnectionUser;
}

/**
 * DTO for sending connection request
 */
export interface SendConnectionRequestDto {
    receiverId: string;
}

/**
 * DTO for updating connection status
 */
export interface UpdateConnectionStatusDto {
    status: 'ACCEPTED' | 'REJECTED';
}
