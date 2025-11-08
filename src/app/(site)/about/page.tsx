
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'About Me',
    description: 'Learn more about the FunToKnow platform, my mission, and my work.',
};

export default function AboutPage() {
  return (
    <div className="container py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">About FunToKnow</h1>
            <p className="mt-4 text-lg text-muted-foreground">A Freelancer's Journey in Creativity and Code</p>
        </header>

        <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-lg border">
            <Image
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmcmVlbGFuY2VyJTIwZGVza3xlbnwwfHx8fDE3NjIyMDk2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="A freelancer's desk with a laptop and notes"
                fill
                className="object-cover"
                data-ai-hint="freelancer desk"
                sizes="(max-width: 1024px) 100vw, 768px"
                priority
            />
        </div>

        <article className="prose">
            <h2>My Mission</h2>
            <p>FunToKnow was born from a passion for game development and a desire to build a community around creative projects. As a freelancer, my mission is to provide a platform where I can showcase my work, share my development journey, and connect with a community of users who appreciate the art and craft of making games and applications.</p>

            <h2>What I Do</h2>
            <p>I am a dedicated developer and designer who believes in the power of independent projects. This platform serves as both a portfolio of my own work and an open space for others to discover new and exciting projects. From indie games to useful libraries, I celebrate the spirit of innovation and enjoy sharing what I build.</p>
            
            <h2>Join My Journey</h2>
            <p>Whether you're a developer, a gamer, or just someone who loves creative technology, I invite you to explore the projects, read my blog, and become part of the FunToKnow community. Your feedback and engagement help shape the future of this platform.</p>
        </article>
      </div>
    </div>
  );
}
