export interface IPost {
  id: string;
  content: string;
  mediaUrls: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  // Included relations often needed
  author?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  _count?: {
    likes: number;
    comments: number;
  };
  likedByCurrentUser?: boolean; // Virtual field for frontend
}

export interface IComment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  _count?: {
    replies: number;
    likes: number;
  };
  likedByCurrentUser?: boolean;
}

export interface ITag {
  id: string;
  name: string;
}

export interface ILike {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
}
