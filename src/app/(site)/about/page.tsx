
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn more about the FunToKnow platform, our mission, and our team.',
};

export default function AboutPage() {
  return (
    <div className="container py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">About FunToKnow</h1>
            <p className="mt-4 text-lg text-muted-foreground">Creativity, Community, and Code</p>
        </header>

        <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-lg border">
            <Image
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NjIxMTEwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Abstract colorful background representing creativity"
                fill
                className="object-cover"
                data-ai-hint="abstract colorful"
                sizes="(max-width: 1024px) 100vw, 768px"
                priority
            />
        </div>

        <article className="prose">
            <h2>Our Mission</h2>
            <p>FunToKnow was born from a passion for game development and a desire to build a community around creative projects. Our mission is to provide a platform where developers can showcase their work, share their journey, and connect with a community of users who appreciate the art and craft of making games and applications.</p>

            <h2>What We Do</h2>
            <p>We are a small, dedicated team of developers and designers who believe in the power of independent projects. This platform serves as both a portfolio of our own work and an open space for others to discover new and exciting projects. From indie games to useful libraries, we celebrate the spirit of innovation.</p>
            
            <h2>The Technology</h2>
            <p>This platform is built with a modern tech stack to provide a fast, reliable, and enjoyable experience. We leverage Next.js for the framework, Firebase for our backend and database needs, and Tailwind CSS for styling. We are always experimenting and evolving, just like the projects we feature.</p>
            
            <h2>Join Our Journey</h2>
            <p>Whether you're a developer, a gamer, or just someone who loves creative technology, we invite you to explore the projects, read our blog, and become part of the FunToKnow community. Your feedback and engagement help shape the future of this platform.</p>
        </article>
      </div>
    </div>
  );
}
