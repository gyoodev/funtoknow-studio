'use client';

import { useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faNewspaper, faUsers, faHome, faExternalLinkAlt, faCog, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

function AdminLoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="mb-4 h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Verifying access...</h1>
          <p className="text-muted-foreground">Please wait while we check your credentials.</p>
      </div>
    </div>
  );
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const isLoading = isUserLoading || isProfileLoading;

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    setIsClient(true);
  }, []);

  useEffect(() => {
    // This effect handles redirection logic, but only on the client side
    // and only after the initial loading of user/profile is complete.
    if (isClient && !isLoading) {
      if (!user || userProfile?.role !== 'admin') {
        router.replace('/admin/login');
      }
    }
  }, [isClient, isLoading, user, userProfile, router]);


  // On the server, and on the initial client render, always show the loading screen.
  // This guarantees no hydration mismatch.
  if (!isClient || isLoading) {
    return <AdminLoadingScreen />;
  }

  // Once loading is complete and we are on the client, if the user is not an admin,
  // render the loading screen while the redirection happens.
  if (!user || userProfile?.role !== 'admin') {
     return <AdminLoadingScreen />;
  }
  
  const userInitial = userProfile?.displayName?.charAt(0)?.toUpperCase() || '?';

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-12 items-center justify-between p-2">
            <Logo />
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/admin">
                  <FontAwesomeIcon icon={faHome} />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Projects">
                <Link href="/admin/projects">
                  <FontAwesomeIcon icon={faGamepad} />
                  <span>Projects</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Blog">
                <Link href="/admin/blog">
                  <FontAwesomeIcon icon={faNewspaper} />
                  <span>Blog</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Users">
                <Link href="/admin/users">
                  <FontAwesomeIcon icon={faUsers} />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="/admin/settings">
                  <FontAwesomeIcon icon={faCog} />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Back to Site">
                <Link href="/" target="_blank">
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  <span>Back to Site</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile.photoURL ?? undefined} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              <span className="truncate text-sm font-semibold">{userProfile.displayName}</span>
              <span className="truncate text-xs text-sidebar-foreground/70">{userProfile.email}</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
