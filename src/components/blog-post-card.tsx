import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
}

export default function BlogPostCard({ post, className }: BlogPostCardProps) {
  const authorInitial = post.author.charAt(0);

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full">
          <Image
              src={post.imageUrl}
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
           <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>

        <div className="mt-4 flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://i.pravatar.cc/40?u=${post.author}`} />
            <AvatarFallback>{authorInitial}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{post.author.split(',')[0]}</p>
            <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
