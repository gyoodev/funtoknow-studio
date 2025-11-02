import ProjectCard from '@/components/project-card';
import { projects } from '@/lib/data';

export default function ProjectsPage() {
  return (
    <div className="container py-16 lg:py-24">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">Our Awards</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          A showcase of our recognized projects and design achievements.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
