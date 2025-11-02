
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRss, faTrophy } from '@fortawesome/free-solid-svg-icons';

import { Button } from '@/components/ui/button';
import { projects, blogPosts } from '@/lib/data';
import ProjectCard from '@/components/project-card';
import BlogPostCard from '@/components/blog-post-card';

export default function HomePage() {

  const tags = [
    'Product', 'Design System', 'Branding', 'Landing Page', 
    'Mobile App UI', 'Web Design', 'Prototyping'
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Design Impactful<br />Experiences for Brands.
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground">
              From concept to execution, we bring together innovation, strategy, and design to create impactful brand experiences.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/contact">
                Let's Collaborate
              </Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-2 md:gap-4">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Floating Images */}
        <div className="absolute inset-0 z-0">
            <Image
                src="https://picsum.photos/seed/img1/500/300"
                alt="Laptop with analytics dashboard"
                width={500}
                height={300}
                className="absolute -left-24 top-1/4 w-64 md:w-80 lg:w-[400px] rounded-2xl shadow-2xl rotate-[-15deg] opacity-70"
                data-ai-hint="laptop analytics"
            />
            <Image
                src="https://picsum.photos/seed/img2/500/300"
                alt="Tablet showing a website design"
                width={500}
                height={300}
                className="absolute -right-24 top-1/3 w-64 md:w-80 lg:w-[400px] rounded-2xl shadow-2xl rotate-[15deg] opacity-70"
                data-ai-hint="tablet website"
            />
             <Image
                src="https://picsum.photos/seed/img3/300/500"
                alt="Mobile phone with an app interface"
                width={300}
                height={500}
                className="absolute bottom-[-10%] left-1/4 -translate-x-1/2 w-32 md:w-40 lg:w-[200px] rounded-2xl shadow-2xl rotate-[10deg] opacity-70"
                data-ai-hint="mobile app"
            />
             <Image
                src="https://picsum.photos/seed/img4/500/300"
                alt="Laptop with code on screen"
                width={500}
                height={300}
                className="absolute bottom-[-15%] right-1/4 translate-x-1/2 w-64 md:w-80 lg:w-[400px] rounded-2xl shadow-2xl rotate-[-5deg] opacity-70"
                data-ai-hint="laptop code"
            />
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
