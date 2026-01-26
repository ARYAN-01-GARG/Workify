/**
 * Centralized type exports for the web application
 * Import from '@/types' for all shared types
 */

// Common types
export type { PaginatedResponse, CursorPaginatedResponse, ApiError, Author } from './common';

// Post types
export type {
  Post,
  Comment,
  CreatePostDto,
  UpdatePostDto,
  CreateCommentDto,
  PostQueryParams,
  CommentQueryParams,
  PostsResponse,
  CommentsResponse,
} from './post';

// User types
export type {
  Education,
  Experience,
  Company,
  CandidateProfile,
  RecruiterProfile,
  UserRole,
  UserProfile,
  UpdateCandidateProfileDto,
  UpdateRecruiterProfileDto,
} from './user';

// Connection types
export type {
  ConnectionStatus,
  ConnectionUser,
  Connection,
  SendConnectionRequestDto,
  UpdateConnectionStatusDto,
} from './connection';
