
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRss, faTrophy } from '@fortawesome/free-solid-svg-icons';

import { Button } from '@/components/ui/button';
import { projects, blogPosts } from '@/lib/data';
import ProjectCard from '@/components/project-card';
import BlogPostCard from '@/components/blog-post-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full">
        {heroImage && (
             <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
             />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold tracking-tighter md:text-6xl font-headline">
            Where Creativity Meets Code
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Discover innovative game projects, read insightful developer blogs, and join a community of creators.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/projects">
              Explore Projects <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="flex flex-col items-center text-center">
             <FontAwesomeIcon icon={faTrophy} className="h-12 w-12 text-primary" />
            <h2 className="mt-4 text-3xl font-bold tracking-tighter md:text-4xl">Projects</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A selection of our recently awarded projects.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/projects">View All Awards</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Latest Blog Posts */}
      <section className="bg-card py-16 lg:py-24">
        <div className="container">
          <div className="flex flex-col items-center text-center">
            <FontAwesomeIcon icon={faRss} className="h-12 w-12 text-primary" />
            <h2 className="mt-4 text-3xl font-bold tracking-tighter md:text-4xl">From the Blog</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Insights, tutorials, and stories from the development front lines.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0,3).map((post) => (
               <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
           <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/blog">Read More Posts</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
