import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <FontAwesomeIcon icon={faGamepad} className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold font-headline tracking-tighter text-primary">
        FunToKnow
      </span>
    </Link>
  );
}
