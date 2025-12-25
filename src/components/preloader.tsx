
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

export function Preloader({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-full min-h-[50vh] flex-col items-center justify-center gap-4', className)}>
        <div className="relative">
            <FontAwesomeIcon icon={faGamepad} className="h-16 w-16 text-primary animate-bounce" />
        </div>
        <span className="text-2xl font-bold font-headline tracking-tighter text-primary">
          FunToKnow
        </span>
        <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
