
'use client';

import { useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import { collection, query, where, limit } from 'firebase/firestore';
import { BlogPostContent } from '@/components/blog-post-content';
import { Preloader } from '@/components/preloader';


export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();

  const postQuery = useMemoFirebase(
    () => (firestore && slug ? query(collection(firestore, 'blogPosts'), where('slug', '==', slug), limit(1)) : null),
    [firestore, slug]
  );
  
  const { data: posts, isLoading, error } = useCollection<BlogPost>(postQuery);
  const post = posts?.[0];

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
     return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold text-destructive">Error Loading Post</h2>
        <p className="text-muted-foreground mt-2">{error.message}</p>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}
