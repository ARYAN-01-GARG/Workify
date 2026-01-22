import type { ChatMessage as DBMessage } from '@repo/db';
import type { UIDataTypes, UIMessage, UIMessagePart, UITools } from 'ai';
import { formatISO } from 'date-fns';

export function convertToUIMessages(messages: DBMessage[]): UIMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role as 'user' | 'assistant' | 'system',
    parts: message.parts as UIMessagePart<UIDataTypes, UITools>[],
    metadata: {
      createdAt: formatISO(message.createdAt),
    },
  }));
}
