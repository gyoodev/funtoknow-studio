'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

type BlogPostPageProps = {
  // params: { slug: string }; // No longer needed
};

// A basic Markdown renderer. For a real app, a library like 'react-markdown' would be better.
const SimpleMarkdownRenderer = ({ content }: { content: string }) => {
    const blocks = content.trim().split(/\n\s*\n/);
  
    return (
      <>
        {blocks.map((block, index) => {
          const trimmedBlock = block.trim();
          if (trimmedBlock.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{trimmedBlock.substring(3)}</h2>;
          }
          if (trimmedBlock.startsWith('# ')) {
            return <h1 key={index} className="text-3xl font-bold mt-10 mb-6">{trimmedBlock.substring(2)}</h1>;
          }
          if (trimmedBlock.match(/^\d+\.\s/)) {
              return (
                  <ol key={index} className="list-decimal list-inside space-y-2 my-4">
                      {trimmedBlock.split('\n').map((item, i) => (
                          <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>
                      ))}
                  </ol>
              )
          }
           if (trimmedBlock.startsWith('- ')) {
              return (
                  <ul key={index} className="list-disc list-inside space-y-2 my-4">
                      {trimmedBlock.split('\n').map((item, i) => (
                          <li key={i}>{item.replace(/^- \s/, '')}</li>
                      ))}
                  </ul>
              )
          }
          if (trimmedBlock) {
            return <p key={index} className="my-4 leading-relaxed">{trimmedBlock}</p>;
          }
          return null;
        })}
      </>
    );
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

        <div className="text-center">
            <p className="text-muted-foreground">Enjoyed this article? Share it with your friends!</p>
            {/* Social share buttons could go here */}
        </div>
      </div>
    </div>
  );
}
