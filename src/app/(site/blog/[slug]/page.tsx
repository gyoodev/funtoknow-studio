
'use client';

import { useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import { BlogPostContent } from '@/components/blog-post-content';
import { Preloader } from '@/components/preloader';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();

  const blogPostQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'blogPosts'), where('slug', '==', slug), limit(1)) : null),
    [firestore, slug]
  );

  const { data: posts, isLoading, error } = useCollection<BlogPost>(blogPostQuery);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    // This could render a specific error component
    console.error(error);
    return <div className="container py-24 text-center">There was an error loading this post.</div>;
  }
  
  const post = posts?.[0];

  if (!post) {
    // This will show a 404 if no post is found after loading.
    notFound();
  }

  return <BlogPostContent post={post} />;
}
