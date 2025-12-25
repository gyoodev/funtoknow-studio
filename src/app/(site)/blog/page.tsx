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

  const featuredPost = blogPosts?.[0];
  const otherPosts = blogPosts?.slice(1);

  return (
    <div className="container py-16 lg:py-24">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">Discover Our Articles</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          All the articles and contents of the site have been updated today. Find what you need quickly and without any problems.
        </p>
      </div>

      <div className="mt-12 space-y-16">
        {isLoading ? (
          <>
            <Skeleton className="h-[450px] w-full" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
            </div>
          </>
        ) : (
          <>
            {featuredPost && (
                <BlogPostCard post={featuredPost} isFeatured={true} />
            )}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {otherPosts?.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
