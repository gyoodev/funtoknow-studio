
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
import Link from 'next/link';

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
    <footer className="border-t bg-card text-card-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
                <Logo />
                <p className="text-sm text-muted-foreground">
                    FunToKnow is a modern web application designed for showcasing game projects, publishing a developer blog, and managing a user community.
                </p>
            </div>
            <div className="md:col-span-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-semibold mb-3">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-3">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-3">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              <FontAwesomeIcon icon={faCopyright} /> {new Date().getFullYear()} FunToKnow. All rights reserved.
            </p>
            <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
