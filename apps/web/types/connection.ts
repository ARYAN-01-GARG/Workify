/**
 * Connection types matching backend API
 */

/**
 * Connection status enum matching @repo/db
 */
export enum ConnectionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

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
 * Note: createdAt and updatedAt are ISO date strings serialized from DateTime fields
 */
export interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
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
  status: ConnectionStatus.ACCEPTED | ConnectionStatus.REJECTED;
}
