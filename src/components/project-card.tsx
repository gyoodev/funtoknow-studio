import Image from 'next/image';
import type { Project } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faPlay, faMusic } from '@fortawesome/free-solid-svg-icons';
import { faApple, faCodepen } from '@fortawesome/free-brands-svg-icons';
import React from 'react';

interface ProjectCardProps {
  project: Project;
}

const iconMap: { [key: string]: React.ElementType } = {
  Gamepad2: (props: any) => <FontAwesomeIcon icon={faGamepad} {...props} />,
  Apple: (props: any) => <FontAwesomeIcon icon={faApple} {...props} />,
  Codepen: (props: any) => <FontAwesomeIcon icon={faCodepen} {...props} />,
  Play: (props: any) => <FontAwesomeIcon icon={faPlay} {...props} />,
  Music: (props: any) => <FontAwesomeIcon icon={faMusic} {...props} />,
};


export default function ProjectCard({ project }: ProjectCardProps) {
    const LogoComponent = iconMap[project.logo];
  return (
    <Card className="group relative flex h-80 flex-col justify-between overflow-hidden bg-card text-card-foreground shadow-lg transition-all duration-300 hover:-translate-y-2">
        <div className="absolute inset-0 z-0">
            <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover object-bottom transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={project.imageHint}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
            <header className="flex items-start justify-between">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", project.logoBg)}>
                    {LogoComponent && <LogoComponent className="h-6 w-6 text-white" />}
                </div>
                <span className="text-xs text-white/70">{project.date}</span>
            </header>

            <div className="space-y-2">
                <p className="text-sm text-white/80">{project.awardType}</p>
                <h3 className="text-xl font-bold">{project.title}</h3>
            </div>

            <footer>
                <p className="text-sm text-white/70">{project.location}</p>
            </footer>
        </div>
    </Card>
  );
}
