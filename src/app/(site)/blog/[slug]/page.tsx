'use client';

import { useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { collection, query, where, limit, getDocs, getFirestore, Firestore } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import { BlogPostContent } from '@/components/blog-post-content';
import { Preloader } from '@/components/preloader';
import { getDb } from '@/firebase/server-init';


// This function runs at build time on the server.
export async function generateStaticParams() {
  try {
    const db = getDb();
    const postsSnapshot = await db.collection('blogPosts').select('slug').get();
    const slugs = postsSnapshot.docs.map(doc => ({
      slug: doc.data().slug,
    }));
    return slugs;
  } catch (error) {
    // During local dev, this may fail if credentials aren't set.
    // In production, this would be a critical build error.
    console.error("Could not generate static params for blog posts:", error);
    return [];
  }
}

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
    return <div className="container py-16 lg:py-24"><Preloader /></div>;
  }

  if (error) {
    // This could render a specific error component
    console.error(error);
    return <div className="container py-24 text-center">There was an error loading this post. Please try again later.</div>;
  }
  
  const post = posts?.[0];

  if (!post) {
    // This will show a 404 if no post is found after loading has completed.
    notFound();
  }

  return <BlogPostContent post={post} />;
}
