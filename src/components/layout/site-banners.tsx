'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { Skeleton } from '../ui/skeleton';

function UnderDevelopmentBanner() {
  return (
    <div className="bg-yellow-500 text-center text-sm font-medium text-yellow-900 p-2">
      <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
      This site is currently under development. Features may be incomplete or change without notice.
    </div>
  );
}

function SystemNotificationBanner({ message }: { message: string }) {
  return (
    <div className="bg-blue-600 text-center text-sm font-medium text-white p-2">
      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
      {message}
    </div>
  );
}

export function SiteBanners() {
  const { settings, isLoading } = useSiteSettings();

  if (isLoading) {
    return (
        <>
            <Skeleton className="h-9 w-full rounded-none" />
            <Skeleton className="h-9 w-full rounded-none mt-1" />
        </>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <>
      {settings.underDevelopment && <UnderDevelopmentBanner />}
      {settings.showSystemNotification && settings.systemNotification && (
        <SystemNotificationBanner message={settings.systemNotification} />
      )}
    </>
  );
}

    