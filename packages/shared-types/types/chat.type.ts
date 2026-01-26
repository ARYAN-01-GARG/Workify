export interface IMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: string | Date;
}

export interface ChatType {
  id: string;
  title?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  messages?: IMessage[];
  userId?: string;
  isPublic?: boolean;
}

export interface UpdateChatInput {
  title?: string;
  isPublic?: boolean;
}
