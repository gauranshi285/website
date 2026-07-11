
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';
import Markdown from 'react-markdown';
import type { Message } from './chat-message';
import { Button } from './ui/button';
import type { Course } from '@/lib/types';

interface ActionableMessageProps {
  message: Message;
  courses: (Course | string)[];
  action: (course: string) => void;
  displayEligibility?: boolean;
  displayPlacementInfo?: boolean;
}

export function ActionableMessage({ message, courses, action, displayEligibility = false, displayPlacementInfo = false }: ActionableMessageProps) {
  return (
    <div className={cn('flex items-start gap-4 justify-start animate-slide-in-bottom')}>
      <Avatar className="h-9 w-9 border">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div className={cn('max-w-xl rounded-lg px-4 py-3 bg-muted')}>
        <article className="prose prose-sm dark:prose-invert text-inherit">
          <Markdown>{message.content}</Markdown>
        </article>
        <div className="mt-4 flex flex-wrap items-start gap-2">
          {courses.map((course) => {
            const isCourseObject = typeof course === 'object' && course !== null;
            const title = isCourseObject ? (course as Course).title : course as string;
            const eligibility = isCourseObject ? (course as Course).eligibility : '';
            const placementInfo = isCourseObject ? (course as Course).placementInfo : '';

            return (
              <Button
                key={title}
                variant="outline"
                size="sm"
                onClick={() => action(title)}
                className="h-auto"
              >
                <div className="flex flex-col items-start whitespace-normal text-left">
                  <span>{title}</span>
                  {displayEligibility && eligibility && (
                    <span className="text-xs font-normal text-muted-foreground">{eligibility}</span>
                  )}
                  {displayPlacementInfo && placementInfo && (
                     <span className="text-xs font-normal text-muted-foreground">{placementInfo}</span>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
