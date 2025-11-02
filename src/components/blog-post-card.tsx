import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const authorInitial = post.author.charAt(0);

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
       <CardHeader className="p-0">
        <Link href={`/blog/${post.slug}`} className="block">
            <div className="relative h-48 w-full">
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
       </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-xl">
           <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="mt-2">{post.excerpt}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-6 pt-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`https://i.pravatar.cc/40?u=${post.author}`} />
            <AvatarFallback>{authorInitial}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.author}</p>
            <p className="text-xs text-muted-foreground">{post.date}</p>
          </div>
        </div>
         <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            Read More <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
