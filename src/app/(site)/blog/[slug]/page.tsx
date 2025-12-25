
import { notFound } from 'next/navigation';
import { getDb } from '@/firebase/server-init';
import type { BlogPost } from '@/lib/types';
import { getSiteSettings } from '@/firebase/server-init';
import type { Metadata } from 'next';
import { BlogPostContent } from '@/components/blog-post-content';

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const db = getDb();
    const postsRef = db.collection('blogPosts');
    const q = postsRef.where('slug', '==', slug).limit(1);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    const publicationDate = data.publicationDate;
    const serializablePublicationDate = (publicationDate && typeof publicationDate.toDate === 'function') 
      ? publicationDate.toDate().toISOString() 
      : null;

    return {
      id: doc.id,
      ...data,
      publicationDate: serializablePublicationDate,
    } as BlogPost;
  } catch (error) {
    console.error(`Failed to fetch blog post with slug "${slug}":`, error);
    // Return null to allow the page to handle it gracefully (e.g., show notFound)
    return null;
  }
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

  const description = post.excerpt || (post.content ? post.content.substring(0, 155) : 'A blog post from FunToKnow.');

  return {
    title: `${post.title} | ${siteName}`,
    description: description,
  };
}


export default async function BlogPostPage({ params }: { params: { slug: string }}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}
