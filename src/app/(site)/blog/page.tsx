'use client';

import BlogPostCard from '@/components/blog-post-card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { BlogPost } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPage() {
  const firestore = useFirestore();
  const blogPostsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'blogPosts'), orderBy('publicationDate', 'desc')) : null),
    [firestore]
  );
  const { data: blogPosts, isLoading } = useCollection<BlogPost>(blogPostsQuery);

  return (
    <div className="container py-16 lg:py-24">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">Developer Blog</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          News, insights, and stories from our game development journey.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[420px] w-full" />)
        ) : (
          blogPosts?.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
