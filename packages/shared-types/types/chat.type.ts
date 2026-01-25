export interface ChatType {
  id: string;
  title?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  messages?: any[];
  userId?: string;
  isPublic?: boolean;
}

export interface UpdateChatInput {
  title?: string;
  isPublic?: boolean;
}
