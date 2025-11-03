'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Reactions } from '@/components/reactions';
import { SocialShare } from '@/components/social-share';
import { SimpleMarkdownRenderer } from '@/components/markdown-renderer';

type BlogPostPageProps = {
  // params: { slug: string }; // No longer needed
};


export default function BlogPostPage({}: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    if (!firestore || !slug) return;

    const fetchPost = async () => {
      setIsLoading(true);
      const postsRef = collection(firestore, 'blogPosts');
      const q = query(postsRef, where('slug', '==', slug));
      
      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setPost(null);
        } else {
          const doc = querySnapshot.docs[0];
          setPost({ id: doc.id, ...doc.data() } as BlogPost);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [firestore, slug]);

  if (isLoading) {
    return (
        <div className="container py-16 lg:py-24">
            <div className="mx-auto max-w-3xl">
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-8 w-3/4 mb-8" />
                <Skeleton className="w-full aspect-video rounded-lg mb-12" />
                <div className="space-y-6">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                </div>
            </div>
        </div>
    );
  }

  if (!post) {
    notFound();
  }

  const authorName = post.author?.split(',')[0] || 'Unknown';
  const authorInitial = authorName.charAt(0);
  const publicationDate = post.publicationDate ? format(post.publicationDate.toDate(), 'MMMM d, yyyy') : post.date;
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
                    <span className="text-sm">{publicationDate}</span>
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
