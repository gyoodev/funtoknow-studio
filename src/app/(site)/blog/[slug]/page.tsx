
import { notFound } from 'next/navigation';
import { getDb } from '@/firebase/server-init';
import type { BlogPost } from '@/lib/types';
import { BlogPostContent } from '@/components/blog-post-content';

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

        // Convert Firestore Timestamp to a serializable format (ISO string)
        const serializablePublicationDate = 
            (data.publicationDate && typeof data.publicationDate.toDate === 'function')
            ? data.publicationDate.toDate().toISOString()
            : null;

        return {
            id: doc.id,
            ...data,
            publicationDate: serializablePublicationDate,
        } as BlogPost;
    } catch (error: any) {
        console.error(`Failed to fetch blog post with slug "${slug}":`, error.message);
        // Return null to allow the page to handle it gracefully (e.g., show notFound)
        return null;
    }
}


export default async function BlogPostPage({ params: { slug } }: { params: { slug: string } }) {
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}
