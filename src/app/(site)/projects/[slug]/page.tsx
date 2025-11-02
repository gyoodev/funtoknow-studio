
'use client';

import { useEffect, useState, useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Project } from '@/lib/types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWindows, faApple, faLinux, faAndroid, faGooglePlay, faAppStore, faSteam, faItchIo,
  faGithub
} from '@fortawesome/free-brands-svg-icons';
import { faDesktop, faLink, faTag, faCode, faList, faCubes, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { SimpleMarkdownRenderer } from '@/components/markdown-renderer';

type ProjectPageProps = {
  params: { slug: string };
};

const osIconMap: Record<Project['os'][number], IconDefinition> = {
  windows: faWindows,
  mac: faApple,
  linux: faLinux,
  android: faAndroid,
  ios: faApple,
  web: faDesktop,
};

const linkIconMap: Record<Project['links'][number]['platform'], IconDefinition> = {
  github: faGithub,
  playstore: faGooglePlay,
  appstore: faAppStore,
  website: faLink,
  steam: faSteam,
  epicgames: faGamepad,
  itchio: faItchIo,
  gog: faGamepad,
  aptoide: faGooglePlay,
};


export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();
  const { slug } = params;

  useEffect(() => {
    if (!firestore || !slug) return;

    const fetchProject = async () => {
      setIsLoading(true);
      const projectsRef = collection(firestore, 'projects');
      const q = query(projectsRef, where('slug', '==', slug));
      
      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setProject(null);
        } else {
          const doc = querySnapshot.docs[0];
          setProject({ id: doc.id, ...doc.data() } as Project);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [firestore, slug]);
  
  const youtubeVideoId = useMemo(() => {
    if (!project?.videoEmbedUrl) return null;
    try {
        const url = new URL(project.videoEmbedUrl);
        if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
            return url.searchParams.get('v');
        }
        if (url.hostname === 'youtu.be') {
            return url.pathname.substring(1);
        }
    } catch (e) {
        return null;
    }
    return null;
  }, [project?.videoEmbedUrl]);


  if (isLoading) {
    return (
      <div className="container py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-8" />
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <Skeleton className="w-full aspect-video rounded-lg" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="container py-16 lg:py-24">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">{project.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <main className="md:col-span-2 space-y-12">
                {youtubeVideoId ? (
                    <div className="aspect-video w-full overflow-hidden rounded-xl border">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : project.gallery && project.gallery.length > 0 && (
                    <Carousel className="w-full">
                        <CarouselContent>
                            {project.gallery.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="relative aspect-video w-full overflow-hidden rounded-xl border">
                                    <Image src={image.url} alt={`${project.title} gallery image ${index + 1}`} fill className="object-cover" data-ai-hint={image.hint} />
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        {project.gallery.length > 1 && <>
                            <CarouselPrevious className="left-4" />
                            <CarouselNext className="right-4" />
                        </>}
                    </Carousel>
                )}

                {project.readme && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faDesktop} className="w-5 h-5" />
                                Project README
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                             <SimpleMarkdownRenderer content={project.readme} />
                        </CardContent>
                    </Card>
                )}
            </main>
            <aside className="space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCubes} className="w-5 h-5" />
                            Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faTag} className="w-4 h-4 text-muted-foreground" />
                            <Badge variant="secondary">{project.version}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCode} className="w-4 h-4 text-muted-foreground" />
                            <Badge variant="outline" className="capitalize">{project.type}</Badge>
                        </div>
                         <Separator />
                        <div className="flex flex-wrap gap-2">
                            {project.os.map(osName => (
                                <Badge key={osName} variant="secondary" className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={osIconMap[osName]} className="w-3 h-3" />
                                    <span className="capitalize">{osName}</span>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                 </Card>

                {project.links && project.links.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faLink} className="w-5 h-5" />
                                Links
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {project.links.map(link => (
                                <a
                                    key={link.platform}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
                                >
                                    <FontAwesomeIcon icon={linkIconMap[link.platform]} className="w-5 h-5 text-muted-foreground" />
                                    <span className="capitalize text-sm font-medium">{link.platform}</span>
                                </a>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </aside>
        </div>
      </div>
    </div>
  );
}
