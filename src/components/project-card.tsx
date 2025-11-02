
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = project.gallery?.[0]?.url || 'https://placehold.co/600x400';
  const imageHint = project.gallery?.[0]?.hint || 'project image';

  return (
    <Card className="group relative flex h-80 flex-col justify-between overflow-hidden bg-card text-card-foreground shadow-lg transition-all duration-300 hover:-translate-y-2">
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
      
      <div className="relative z-20 flex h-full flex-col justify-end p-6 text-white">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="text-sm text-white/80 line-clamp-2">{project.description}</p>
        </div>
      </div>
    </Card>
  );
}
