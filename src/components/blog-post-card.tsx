
'use client';

import Image from 'next/image';
import type { BlogPost } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BlogPostContent } from './blog-post-content';
import { ScrollArea } from './ui/scroll-area';

interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
  isFeatured?: boolean;
}

export default function BlogPostCard({ post, className, isFeatured = false }: BlogPostCardProps) {
  const authorName = post.author?.split(',')[0] || 'Unknown Author';
  const authorInitial = authorName.charAt(0);
  
  let publicationDate = 'Date not available';
  try {
    if (post.publicationDate) {
      const dateToFormat = (post.publicationDate as any)?.toDate ? (post.publicationDate as any).toDate() : new Date(post.publicationDate);
      publicationDate = format(dateToFormat, 'MMMM d, yyyy');
    } else if (post.date) {
      publicationDate = post.date;
    }
  } catch (error) {
    console.warn("Could not format blog post date", post.publicationDate);
    publicationDate = post.date || 'Invalid Date';
  }

  const cardContent = isFeatured ? (
     <Card className={cn("overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 relative flex flex-col md:flex-row items-center", className)}>
        <div className="relative w-full md:w-1/2 aspect-video">
            <Image
                src={post.imageUrl || 'https://placehold.co/800x450'}
                alt={post.title}
                fill
                className="object-cover rounded-l-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                data-ai-hint={post.imageHint}
            />
        </div>
        <CardContent className="p-8 md:p-12 flex flex-col justify-center md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                <AvatarFallback>{authorInitial}</AvatarFallback>
                </Avatar>
                <div>
                <p className="text-base font-medium leading-none">{authorName}</p>
                <p className="text-sm text-muted-foreground mt-1">{publicationDate}</p>
                </div>
            </div>
            <h2 className="font-headline text-3xl font-bold leading-tight">
                <span className="group-hover:text-primary transition-colors">
                    {post.title}
                </span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground line-clamp-3">{post.excerpt}</p>
             <Button variant="link" className="p-0 mt-4 h-auto justify-start text-base">
                Read More
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
        </CardContent>
    </Card>
  ) : (
    <Card className={cn("overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 flex flex-col", className)}>
        <div className="relative w-full aspect-video">
          <Image
              src={post.imageUrl || 'https://placehold.co/400x300'}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={post.imageHint}
          />
           <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-background/70 backdrop-blur-sm p-2 rounded-full">
             <Avatar className="h-8 w-8">
                <AvatarFallback>{authorInitial}</AvatarFallback>
             </Avatar>
             <p className="text-xs font-medium mr-2">{authorName}</p>
           </div>
        </div>
        <CardContent className="p-6 flex flex-col flex-grow">
          <div>
            <h3 className="font-headline text-lg font-bold leading-snug mb-2">
              <span className="line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </span>
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
          </div>
          <div className="flex-grow" />
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
             <span>{publicationDate}</span>
             <span className="group-hover:text-primary transition-colors">Read More &rarr;</span>
          </div>
        </CardContent>
      </Card>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="block group cursor-pointer">{cardContent}</div>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full h-[90vh] p-0 flex flex-col">
        <ScrollArea className="h-full">
            <BlogPostContent post={post} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
