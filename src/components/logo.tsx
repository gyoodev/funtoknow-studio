import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Gamepad2 className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold font-headline tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        FunToKnow
      </span>
    </Link>
  );
}
