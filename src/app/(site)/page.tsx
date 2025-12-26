
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRss, faTrophy, faGamepad, faUsers, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Project, BlogPost } from '@/lib/types';

import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/project-card';
import BlogPostCard from '@/components/blog-post-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-section');


  const firestore = useFirestore();
  const projectsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'projects'), orderBy('createdAt', 'desc'), limit(3)) : null),
    [firestore]
  );
  const { data: projects, isLoading: isLoadingProjects } = useCollection<Project>(projectsQuery);

  const blogPostsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'blogPosts'), orderBy('publicationDate', 'desc'), limit(3)) : null),
    [firestore]
  );
  const { data: blogPosts, isLoading: isLoadingBlogPosts } = useCollection<BlogPost>(blogPostsQuery);


  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-24 lg:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="rounded-lg bg-background/50 p-4 backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-none">
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
            className="absolute -left-24 top-1/4 w-48 md:w-80 lg:w-[400px] rounded-2xl shadow-2xl rotate-[-15deg] opacity-50 md:opacity-70"
            data-ai-hint={floatingImage1.imageHint}
          />}
          {floatingImage2 && <Image
            src={floatingImage2.imageUrl}
            alt={floatingImage2.description}
            width={500}
            height={300}
            className="absolute -right-24 top-1/3 w-48 md:w-80 lg:w-[400px] rounded-2xl shadow-2xl rotate-[15deg] opacity-50 md:opacity-70"
            data-ai-hint={floatingImage2.imageHint}
          />}
          {floatingImage3 && <Image
            src={floatingImage3.imageUrl}
            alt={floatingImage3.description}
            width={300}
            height={500}
            className="hidden md:block absolute bottom-[-10%] left-1/4 -translate-x-1/2 w-32 md:w-40 lg:w-[200px] rounded-2xl shadow-2xl rotate-[10deg] opacity-70"
            data-ai-hint={floatingImage3.imageHint}
          />}
          {floatingImage4 && <Image
            src={floatingImage4.imageUrl}
            alt={floatingImage4.description}
            width={500}
            height={300}
            className="hidden lg:block absolute bottom-[-15%] right-1/4 translate-x-1/2 w-64 md:w-80 lg:w-[400px] rounded-2xl shadow-2xl rotate-[-5deg] opacity-70"
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
      
      {/* About Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">About Our Company</p>
              <h2 className="text-3xl md:text-4xl font-bold">Creative Solutions to Boost Your Games</h2>
              <div className="grid grid-cols-3 gap-4 text-center my-8">
                <div>
                  <p className="text-3xl font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">Happy Clients</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">15+</p>
                  <p className="text-sm text-muted-foreground">Games Released</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">1M+</p>
                  <p className="text-sm text-muted-foreground">Players Reached</p>
                </div>
              </div>
              {aboutImage && <Image src={aboutImage.imageUrl} alt={aboutImage.description} width={600} height={400} className="rounded-xl shadow-lg w-full h-auto" data-ai-hint={aboutImage.imageHint} />}
            </div>
            <div className="space-y-6">
              <Card className="bg-background hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FontAwesomeIcon icon={faGamepad} /> Game Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Our game design philosophy focuses on creating engaging, intuitive, and memorable experiences that captivate players and drive retention.</p>
                  <Button variant="link" className="p-0 mt-2">
                    <Link href="/about">Read More <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3 w-3" /></Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-background hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FontAwesomeIcon icon={faUsers} /> Community Building</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">We help you build and nurture a thriving community around your game, fostering a loyal player base that supports long-term success.</p>
                  <Button variant="link" className="p-0 mt-2">
                    <Link href="/about">Read More <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3 w-3" /></Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-background hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FontAwesomeIcon icon={faDollarSign} /> Monetization Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Our expert strategies help you implement effective and ethical monetization models that enhance player experience while maximizing revenue.</p>
                  <Button variant="link" className="p-0 mt-2">
                    <Link href="/about">Read More <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3 w-3" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
