import { cn } from '@/lib/utils';

export function Logo({ className, hideText = false }: { className?: string; hideText?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="bg-gradient-to-br from-primary via-primary/90 to-blue-600 rounded-lg p-2 text-primary-foreground shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
        </svg>
      </div>
      {!hideText && (
        <span className="text-xl font-bold tracking-tight text-foreground">
          CampusConnect AI
        </span>
      )}
    </div>
  );
}
