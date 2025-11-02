'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRss, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Project } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { blogPosts } from '@/lib/data';
import ProjectCard from '@/components/project-card';
import BlogPostCard from '@/components/blog-post-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const tags = [
    'Mobile Game Development',
    'Desktop Game Development',
    'Mobile App Development',
    'Desktop App Development',
  ];

  const floatingImage1 = PlaceHolderImages.find(p => p.id === 'hero-float-1');
  const floatingImage2 = PlaceHolderImages.find(p => p.id === 'hero-float-2');
  const floatingImage3 = PlaceHolderImages.find(p => p.id === 'hero-float-3');
  const floatingImage4 = PlaceHolderImages.find(p => p.id === 'hero-float-4');

  const firestore = useFirestore();
  const projectsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'projects'), orderBy('createdAt', 'desc'), limit(3)) : null),
    [firestore]
  );
  const { data: projects, isLoading: isLoadingProjects } = useCollection<Project>(projectsQuery);


  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl rounded-lg bg-background/50 p-4 text-center backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-none">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Design Impactful
              <br />
              Experiences for Brands.
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground">
              From concept to execution, we bring together innovation,
              strategy, and design to create impactful brand experiences.
            </p>
            <Button asChild size="lg" className="mt-8 group">
              <Link href="/projects">
                Projects
                <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover:translate-x-1 group-active:translate-x-2" />
              </Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-2 md:gap-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Floating Images */}
        <div className="absolute inset-0 z-0">
          {floatingImage1 && <Image
            src={floatingImage1.imageUrl}
            alt={floatingImage1.description}
            width={500}
            height={300}
            className="absolute -left-24 top-1/4 w-64 md:w-80 lg:w-[400px] rounded-2xl shadow-2xl rotate-[-15deg] opacity-70"
            data-ai-hint={floatingImage1.imageHint}
          />}
          {floatingImage2 && <Image
            src={floatingImage2.imageUrl}
            alt={floatingImage2.description}
            width={500}
            height={300}
            className="absolute -right-24 top-1/3 w-64 md:w-80 lg:w-[400px] rounded-2xl shadow-2xl rotate-[15deg] opacity-70"
            data-ai-hint={floatingImage2.imageHint}
          />}
          {floatingImage3 && <Image
            src={floatingImage3.imageUrl}
            alt={floatingImage3.description}
            width={300}
            height={500}
            className="absolute bottom-[-10%] left-1/4 -translate-x-1/2 w-32 md:w-40 lg:w-[200px] rounded-2xl shadow-2xl rotate-[10deg] opacity-70"
            data-ai-hint={floatingImage3.imageHint}
          />}
          {floatingImage4 && <Image
            src={floatingImage4.imageUrl}
            alt={floatingImage4.description}
            width={500}
            height={300}
            className="absolute bottom-[-15%] right-1/4 translate-x-1/2 w-64 md:w-80 lg:w-[400px] rounded-2xl shadow-2xl rotate-[-5deg] opacity-70"
            data-ai-hint={floatingImage4.imageHint}
          />}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="flex flex-col items-center text-center">
            <FontAwesomeIcon icon={faTrophy} className="h-12 w-12 text-primary" />
            <h2 className="mt-4 text-3xl font-bold tracking-tighter md:text-4xl">
              Projects
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A selection of our most recent projects.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
             {isLoadingProjects ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)
            ) : (
              projects?.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="bg-card py-16 lg:py-24">
        <div className="container">
          <div className="flex flex-col items-center text-center">
            <FontAwesomeIcon icon={faRss} className="h-12 w-12 text-primary" />
            <h2 className="mt-4 text-3xl font-bold tracking-tighter md:text-4xl">
              From the Blog
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Insights, tutorials, and stories from the development front
              lines.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
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
