
'use client';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import type { BlogPost } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Reactions } from '@/components/reactions';
import { SocialShare } from '@/components/social-share';
import { SimpleMarkdownRenderer } from '@/components/markdown-renderer';

export function BlogPostContent({ post }: { post: BlogPost }) {
  const authorName = post.author?.split(',')[0] || 'Unknown';
  const authorInitial = authorName.charAt(0);
  
  let formattedDate = post.date || '';
  if (post.publicationDate) {
    try {
      // The publicationDate from the server is now an ISO string
      formattedDate = format(new Date(post.publicationDate), 'MMMM d, yyyy');
    } catch (e) {
      // Fallback if parsing fails
      formattedDate = 'Invalid Date';
    }
  }
  
  const initialReactions = post.reactions || { love: 0, like: 0, applause: 0, funny: 0, sad: 0 };

  return (
    <div className="container py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{authorInitial}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{authorName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} className="h-4 w-4" />
                    <span className="text-sm">{formattedDate}</span>
                </div>
            </div>
        </header>
        
        <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-lg border">
            <Image
                src={post.imageUrl || 'https://placehold.co/800x400'}
                alt={post.title}
                fill
                className="object-cover"
                data-ai-hint={post.imageHint}
                sizes="(max-width: 1024px) 100vw, 768px"
                priority
            />
        </div>

        <article className="prose">
            <SimpleMarkdownRenderer content={post.content} />
        </article>

        <Separator className="my-12" />
        
        <div className="space-y-6 text-center">
            <h3 className="text-lg font-semibold">What did you think of this article?</h3>
            <Reactions postId={post.id} initialCounts={initialReactions} />
        </div>


        <Separator className="my-12" />

        <div className="text-center">
            <p className="text-muted-foreground mb-4">Enjoyed this article? Share it with your friends!</p>
            <SocialShare title={post.title} />
        </div>
      </div>
    </div>
  );
}
