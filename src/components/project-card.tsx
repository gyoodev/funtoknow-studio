import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';
import type { Project } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={project.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-xl">
          <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
            {project.title}
          </Link>
        </CardTitle>
        <CardDescription className="mt-2">{project.description}</CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary">{tech}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="flex w-full items-center justify-end gap-2">
          {project.links.github && (
            <Button variant="ghost" size="sm" asChild>
              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </a>
            </Button>
          )}
          {project.links.live && (
            <Button variant="default" size="sm" asChild>
              <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
