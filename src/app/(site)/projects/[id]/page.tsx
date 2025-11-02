import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';

import { projects } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type ProjectPageProps = {
  params: { id: string };
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container py-16 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">{project.title}</h1>
          <p className="text-lg text-muted-foreground">{project.description}</p>
          <div className="flex justify-center flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
          </div>
        </div>

        <div className="my-12">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border shadow-lg">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              data-ai-hint={project.imageHint}
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-12">
            {project.links.github && (
                <Button variant="outline" asChild>
                <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <Github /> View on GitHub
                </a>
                </Button>
            )}
            {project.links.live && (
                <Button asChild>
                <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                    <ExternalLink /> Visit Live Site
                </a>
                </Button>
            )}
        </div>
        
        <Separator />

        <article className="prose mt-12">
            <h2>About this Project</h2>
            <p>{project.longDescription}</p>
        </article>
      </div>
    </div>
  );
}
