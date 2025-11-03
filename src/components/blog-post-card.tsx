import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
}

export default function BlogPostCard({ post, className }: BlogPostCardProps) {
  const authorName = post.author?.split(',')[0] || 'Unknown Author';
  const authorInitial = authorName.charAt(0);
  const publicationDate = post.publicationDate ? format(post.publicationDate.toDate(), 'MMMM d, yyyy') : post.date;

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card className={cn("overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 flex flex-col md:flex-row", className)}>
        <div className="relative w-full md:w-1/3 aspect-[4/3] md:aspect-auto">
          <Image
              src={post.imageUrl || 'https://placehold.co/400x300'}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              data-ai-hint={post.imageHint}
          />
        </div>
        <CardContent className="p-4 md:p-6 flex flex-col justify-between md:w-2/3">
          <div>
            <h3 className="font-headline text-lg font-bold leading-snug">
              <span className="line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </span>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://i.pravatar.cc/40?u=${post.author}`} />
              <AvatarFallback>{authorInitial}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{authorName}</p>
              <p className="text-xs text-muted-foreground mt-1">{publicationDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
