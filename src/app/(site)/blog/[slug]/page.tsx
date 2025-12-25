'use client';

import { useParams, notFound } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import type { BlogPost } from '@/lib/types';
import { BlogPostContent } from '@/components/blog-post-content';
import { Skeleton } from '@/components/ui/skeleton';

function PostSkeleton() {
    return (
        <div className="container py-16 lg:py-24">
            <div className="mx-auto max-w-3xl">
                 <header className="mb-12 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                    <div className="flex items-center gap-6">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                </header>
                <Skeleton className="aspect-video w-full mb-12" />
                <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                </div>
            </div>
        </div>
    )
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const firestore = useFirestore();

  const postQuery = useMemoFirebase(
    () => (firestore && slug ? query(collection(firestore, 'blogPosts'), where('slug', '==', slug), limit(1)) : null),
    [firestore, slug]
  );
  
  const { data: posts, isLoading } = useCollection<BlogPost>(postQuery);
  const post = posts?.[0];

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}
