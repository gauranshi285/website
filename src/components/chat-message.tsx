'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import Markdown from 'react-markdown';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  component?: string;
  componentProps?: any;
};

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-center text-sm text-destructive">{message.content}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start gap-4 animate-slide-in-bottom',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-9 w-9 border">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xl rounded-lg px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <article className="prose prose-sm dark:prose-invert text-inherit">
          <Markdown>{message.content}</Markdown>
        </article>
      </div>
       {isUser && (
        <Avatar className="h-9 w-9 border">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
