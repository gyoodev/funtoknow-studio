
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie_consent');
    if (cookieConsent !== 'accepted') {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary text-secondary-foreground shadow-lg">
      <div className="container mx-auto p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center sm:text-left">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          Learn more in our{' '}
          <Link href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
        <Button onClick={handleAccept} size="sm">
          Accept
        </Button>
      </div>
    </div>
  );
}
