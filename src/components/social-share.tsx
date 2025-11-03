'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Input } from './ui/input';

interface SocialShareProps {
  title: string;
}

export function SocialShare({ title }: SocialShareProps) {
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const socialLinks = [
    {
      name: 'Twitter',
      icon: faTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'Facebook',
      icon: faFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: faLinkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
  ];

  const handleCopy = () => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setIsCopied(true);
      toast({
        title: 'Link Copied!',
        description: 'The article URL has been copied to your clipboard.',
      });
      setTimeout(() => setIsCopied(false), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast({
        title: 'Error',
        description: 'Failed to copy the link.',
        variant: 'destructive',
      });
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        {socialLinks.map((social) => (
          <Button
            key={social.name}
            variant="outline"
            size="icon"
            asChild
          >
            <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${social.name}`}>
              <FontAwesomeIcon icon={social.icon} />
            </a>
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input value={currentUrl} readOnly className="text-sm" />
        <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy link">
          <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} className={isCopied ? "text-green-500" : ""} />
        </Button>
      </div>
    </div>
  );
}
