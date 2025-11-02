import BlogPostCard from '@/components/blog-post-card';
import { blogPosts } from '@/lib/data';

export default function BlogPage() {
  return (
    <div className="container py-16 lg:py-24">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">Developer Blog</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          News, insights, and stories from our game development journey.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
