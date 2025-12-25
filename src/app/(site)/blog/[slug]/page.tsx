
'use client';

import { useParams, notFound } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { getDb } from '@/firebase/server-init';
import { collection, query, where, limit } from 'firebase/firestore';
import type { BlogPost } from '@/lib/types';
import { BlogPostContent } from '@/components/blog-post-content';
import { Skeleton } from '@/components/ui/skeleton';

export async function generateStaticParams() {
  try {
    const db = getDb();
    const snapshot = await db.collection('blogPosts').get();
    const paths = snapshot.docs.map((doc) => ({
      slug: doc.data().slug,
    }));
    return paths;
  } catch (error) {
    // In a production build, it's better to return an empty array
    // than to crash the build. The pages will be generated on-demand.
    console.error("Failed to generate static params for blog posts:", (error as Error).message);
    return [];
  }
}

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

  // After loading, if posts array is empty, it means no post was found for this slug.
  if (!isLoading && (!posts || posts.length === 0)) {
    notFound();
  }

  // If we are still loading or the post is not yet available, render the skeleton.
  // This helps prevent a flash of a not-found page before data loads.
  if (!post) {
      return <PostSkeleton />;
  }

  return <BlogPostContent post={post} />;
}
