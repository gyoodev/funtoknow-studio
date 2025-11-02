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
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full">
          <Image
              src={post.imageUrl || 'https://placehold.co/800x400'}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={post.imageHint}
          />
        </div>
      </Link>
      <CardContent className="p-4 md:p-6">
         <h3 className="font-headline text-lg font-semibold leading-snug">
           <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>}

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
  );
}
