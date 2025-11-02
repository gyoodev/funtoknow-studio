'use client';

import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faLinkedin, faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import { collection, query, orderBy } from 'firebase/firestore';

import { Logo } from '@/components/logo';
import { Button } from '../ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { SocialLink } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const socialIconMap: Record<SocialLink['platform'], IconDefinition> = {
  github: faGithub,
  twitter: faTwitter,
  linkedin: faLinkedin,
  facebook: faFacebook,
  instagram: faInstagram,
  youtube: faYoutube,
};

function SocialLinks() {
  const firestore = useFirestore();
  const socialLinksQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'socialLinks'), orderBy('order')) : null),
    [firestore]
  );
  const { data: socialLinks, isLoading } = useCollection<SocialLink>(socialLinksQuery);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    );
  }

  if (!socialLinks || socialLinks.length === 0) {
    return <div className="h-9" />; // Placeholder for alignment
  }

  return (
    <div className="flex items-center gap-2">
      {socialLinks.map((link) => (
        <Button variant="ghost" size="icon" asChild key={link.id}>
          <a href={link.url} aria-label={link.platform} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={socialIconMap[link.platform]} className="h-5 w-5" />
          </a>
        </Button>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground order-3 md:order-1">
              <FontAwesomeIcon icon={faCopyright} /> {new Date().getFullYear()} FunToKnow. All rights reserved.
            </p>
            <div className="order-1 md:order-2">
                <Logo />
            </div>
            <div className="order-2 md:order-3">
                <SocialLinks />
            </div>
        </div>
      </div>
    </footer>
  );
}
