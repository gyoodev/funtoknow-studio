import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

import { blogPosts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

type BlogPostPageProps = {
  params: { slug: string };
};

// This function allows Next.js to generate static pages for each blog post at build time.
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

const SimpleMarkdownRenderer = ({ content }: { content: string }) => {
  // A very basic parser to handle the structure of the mock data.
  // It splits content by double newlines to create blocks.
  const blocks = content.trim().split(/\n\s*\n/);

  return (
    <>
      {blocks.map((block, index) => {
        const trimmedBlock = block.trim();
        if (trimmedBlock.startsWith('## ')) {
          return <h2 key={index}>{trimmedBlock.substring(3)}</h2>;
        }
        if (trimmedBlock.startsWith('# ')) {
          return <h1 key={index}>{trimmedBlock.substring(2)}</h1>;
        }
        if (trimmedBlock.startsWith('1. ')) {
            return (
                <ol key={index} className="list-decimal list-inside space-y-2">
                    {trimmedBlock.split('\n').map((item, i) => (
                        <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>
                    ))}
                </ol>
            )
        }
        if (trimmedBlock) {
          return <p key={index}>{trimmedBlock}</p>;
        }
        return null;
      })}
    </>
  );
};


export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const authorName = post.author.split(',')[0];
  const authorInitial = authorName.charAt(0);

  return (
    <div className="container py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://i.pravatar.cc/40?u=${post.author}`} alt={authorName} />
                        <AvatarFallback>{authorInitial}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} className="h-4 w-4" />
                    <span className="text-sm">{post.date}</span>
                </div>
            </div>
        </header>
        
        <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-lg border">
            <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                data-ai-hint={post.imageHint}
                sizes="(max-width: 1024px) 100vw, 768px"
                priority
            />
        </div>

        <article className="prose">
            <SimpleMarkdownRenderer content={post.content} />
        </article>

        <Separator className="my-12" />

        <div className="text-center">
            <p className="text-muted-foreground">Enjoyed this article? Share it with your friends!</p>
            {/* Social share buttons could go here */}
        </div>
      </div>
    </div>
  );
}
