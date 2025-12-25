
import { notFound } from 'next/navigation';
import { getDb } from '@/firebase/server-init';
import type { Project } from '@/lib/types';
import { getSiteSettings } from '@/firebase/server-init';
import type { Metadata } from 'next';
import { ProjectDetailsContent } from '@/components/project-details-content';


async function getProject(slug: string): Promise<Project | null> {
    try {
        const db = getDb();
        const projectsRef = db.collection('projects');
        const q = projectsRef.where('slug', '==', slug).limit(1);
        const querySnapshot = await q.get();

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();

        const createdAt = data.createdAt;
        const serializableCreatedAt = (createdAt && typeof createdAt.toDate === 'function') 
          ? createdAt.toDate().toISOString() 
          : null;

        return {
            id: doc.id,
            ...data,
            createdAt: serializableCreatedAt,
        } as Project;
    } catch (error) {
        console.error(`Failed to fetch project with slug "${slug}":`, error);
        // Return null to allow the page to handle it gracefully (e.g., show notFound)
        return null;
    }
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
