/**
 * Common shared types for API responses and utilities
 */

/**
 * Generic paginated response matching Swagger API spec
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  nextCursor?: string;
}

/**
 * Cursor-based pagination response (used by posts feed)
 */
export interface CursorPaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

/**
 * Standard API error response
 */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

/**
 * Author information embedded in posts/comments
 */
export interface Author {
  id: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
}
