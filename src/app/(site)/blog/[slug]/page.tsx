
import { notFound } from 'next/navigation';
import { getDb } from '@/firebase/server-init';
import type { BlogPost } from '@/lib/types';
import { getSiteSettings } from '@/firebase/server-init';
import type { Metadata } from 'next';
import { BlogPostContent } from '@/components/blog-post-content';

async function getPost(slug: string): Promise<BlogPost | null> {
  const db = getDb();
  const postsRef = db.collection('blogPosts');
  const q = postsRef.where('slug', '==', slug).limit(1);
  const querySnapshot = await q.get();

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    // Convert Firestore Timestamp to a serializable format (ISO string)
    publicationDate: data.publicationDate?.toDate().toISOString(),
  } as BlogPost;
}


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  const siteSettings = await getSiteSettings();
  const siteName = siteSettings?.siteName || 'FunToKnow Platform';

  if (!post) {
    return {
      title: `Post Not Found | ${siteName}`,
    };
  }

  return {
    title: `${post.title} | ${siteName}`,
    description: post.excerpt || post.content.substring(0, 155),
  };
}


export default async function BlogPostPage({ params }: { params: { slug: string }}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}
