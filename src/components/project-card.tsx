
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = project.gallery?.[0]?.url || 'https://placehold.co/600x400';
  const imageHint = project.gallery?.[0]?.hint || 'project image';

  return (
    <Card className="group relative flex h-80 flex-col overflow-hidden bg-card text-card-foreground shadow-lg transition-all duration-300 hover:-translate-y-2">
      <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-10" aria-label={`View ${project.title}`} />
      <div className="absolute inset-0 z-0">
        <Image
            src={imageUrl}
            alt={project.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={imageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </div>
      
      <div className="relative z-20 flex h-full flex-col justify-between p-6 text-white">
        <div /> 
        <div className="flex flex-col items-center justify-center text-center">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm transition-all group-hover:bg-white group-hover:text-primary scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                See Project
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="text-sm text-white/80 line-clamp-2">{project.description}</p>
        </div>
      </div>
    </Card>
  );
}
