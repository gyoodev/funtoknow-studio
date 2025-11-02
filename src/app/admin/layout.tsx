'use client';

import { useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
import { faGamepad, faNewspaper, faUsers, faHome, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);
  const router = useRouter();

  const isLoading = isUserLoading || isProfileLoading;

  useEffect(() => {
    // This effect handles redirection once loading is complete.
    if (!isLoading) {
      if (!user) {
        // If there's no user, redirect to login.
        router.replace('/login');
      } else if (userProfile?.role !== 'admin') {
        // If the user is not an admin, redirect to the homepage.
        router.replace('/');
      }
    }
  }, [user, userProfile, isLoading, router]);

  // While loading, or if the user is not an admin, show a loading screen.
  // This prevents the admin content from ever rendering for non-admins.
  if (isLoading || !userProfile || userProfile.role !== 'admin') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          {/* You could add a spinner here */}
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  // If loading is complete and user is an admin, render the layout.
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
