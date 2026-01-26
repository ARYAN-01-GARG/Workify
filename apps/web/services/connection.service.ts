import { ApiClient } from '@/lib/api-client';
import type { Connection, SendConnectionRequestDto, UpdateConnectionStatusDto } from '@/types';

/**
 * Connection service - handles all connection-related API calls
 * Uses static methods per project workflow standards
 */
export class ConnectionService {
    /**
     * Send a connection request to another user
     */
    static async sendRequest(data: SendConnectionRequestDto): Promise<Connection> {
        return ApiClient.post<Connection>('/connections', data);
    }

    /**
     * Accept or reject a connection request
     */
    static async updateStatus(connectionId: string, data: UpdateConnectionStatusDto): Promise<Connection> {
        return ApiClient.patch<Connection>(`/connections/${connectionId}`, data);
    }

    /**
     * Get all accepted connections for current user
     */
    static async getConnections(): Promise<Connection[]> {
        return ApiClient.get<Connection[]>('/connections');
    }

    /**
     * Get pending connection requests received by current user
     */
    static async getPendingRequests(): Promise<Connection[]> {
        return ApiClient.get<Connection[]>('/connections/pending');
    }

    /**
     * Cancel a pending connection request (only sender can cancel)
     */
    static async cancelRequest(connectionId: string): Promise<void> {
        return ApiClient.delete(`/connections/${connectionId}`);
    }
}
