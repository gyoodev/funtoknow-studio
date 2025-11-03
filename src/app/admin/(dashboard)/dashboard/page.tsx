'use client';

import { useMemo } from 'react';
import { collection, query } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Project, BlogPost, UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faGamepad, faNewspaper, faUsers, faInbox } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import type { ContactMessage } from '@/lib/types';

function StatCard({ title, value, icon, href, isLoading }: { title: string, value: number, icon: any, href: string, isLoading: boolean }) {
  return (
    <Card>
      <Link href={href}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <FontAwesomeIcon icon={icon} className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold">{value}</div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'projects')) : null, [firestore]);
  const blogPostsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'blogPosts')) : null, [firestore]);
  const usersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'users')) : null, [firestore]);
  const messagesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'contactMessages')) : null, [firestore]);


  const { data: projects, isLoading: isLoadingProjects } = useCollection<Project>(projectsQuery);
  const { data: blogPosts, isLoading: isLoadingBlogPosts } = useCollection<BlogPost>(blogPostsQuery);
  const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersQuery);
  const { data: messages, isLoading: isLoadingMessages } = useCollection<ContactMessage>(messagesQuery);

  const isLoading = isLoadingProjects || isLoadingBlogPosts || isLoadingUsers || isLoadingMessages;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome to the control center for the FunToKnow Platform.</p>
      
      <div className="mt-8 grid gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <FontAwesomeIcon icon={faInfoCircle} className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>Welcome to the FunToKnow Admin Panel</CardTitle>
                    <CardDescription>
                        This panel was developed by GKDEV to provide a centralized interface for managing your application.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4">From here, you can manage all the core aspects of your site. Use the navigation above to access the main functions:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><strong>Projects:</strong> Add, edit, or remove the game projects displayed on your site.</li>
                    <li><strong>Blog:</strong> Create and manage all of your developer blog posts.</li>
                    <li><strong>Users:</strong> View registered users and manage their roles and permissions.</li>
                    <li><strong>Settings:</strong> Configure global site settings, social media links, and banners.</li>
                </ul>
            </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Total Projects"
            value={projects?.length || 0}
            icon={faGamepad}
            href="/admin/projects"
            isLoading={isLoading}
        />
         <StatCard 
            title="Total Blog Posts"
            value={blogPosts?.length || 0}
            icon={faNewspaper}
            href="/admin/blog"
            isLoading={isLoading}
        />
         <StatCard 
            title="Total Users"
            value={users?.length || 0}
            icon={faUsers}
            href="/admin/users"
            isLoading={isLoading}
        />
        <StatCard
            title="Contact Messages"
            value={messages?.length || 0}
            icon={faInbox}
            href="/admin/messages"
            isLoading={isLoading}
        />
      </div>
    </div>
  );
}
