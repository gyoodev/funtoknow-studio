'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Project } from '@/lib/types';
import ProjectCard from '@/components/project-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsPage() {
  const firestore = useFirestore();
  const projectsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'projects'), orderBy('createdAt', 'desc')) : null),
    [firestore]
  );
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  return (
    <div className="container py-16 lg:py-24">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">Our Projects</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          A showcase of our recognized projects and design achievements.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)
        ) : (
            projects?.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))
        )}
      </div>
    </div>
  );
}
