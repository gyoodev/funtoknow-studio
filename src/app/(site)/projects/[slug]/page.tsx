
import { notFound } from 'next/navigation';
import { getDb } from '@/firebase/server-init';
import type { Project } from '@/lib/types';
import { getSiteSettings } from '@/firebase/server-init';
import type { Metadata } from 'next';
import { ProjectDetailsContent } from '@/components/project-details-content';


async function getProject(slug: string): Promise<Project | null> {
    const db = getDb();
    const projectsRef = db.collection('projects');
    const q = projectsRef.where('slug', '==', slug).limit(1);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
    } as Project;
}


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug);
  const siteSettings = await getSiteSettings();
  const siteName = siteSettings?.siteName || 'FunToKnow Platform';
  
  if (!project) {
    return {
      title: `Project Not Found | ${siteName}`,
    };
  }

  return {
    title: `${project.title} | ${siteName}`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailsContent project={project} />;
}
