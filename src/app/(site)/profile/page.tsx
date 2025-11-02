'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectSuggester } from '@/components/ai/project-suggester';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
        <div className="container py-16 lg:py-24">
            <div className="mx-auto max-w-4xl space-y-12">
                <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div>
                        <Skeleton className="h-12 w-64 mb-2" />
                        <Skeleton className="h-6 w-80" />
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-5 w-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4">Could Not Load Profile</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          There was an issue loading your profile data. This can sometimes happen if profile creation was interrupted. Please try logging in again.
        </p>
        <Button onClick={() => router.push('/login')}>Return to Login</Button>
      </div>
    );
  }
  
  const userInitial = userProfile.displayName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="container py-16 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 text-3xl">
            <AvatarImage src={user.photoURL || undefined} alt={userProfile.displayName} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">{userProfile.displayName}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{userProfile.email}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Suggester</CardTitle>
            <CardDescription>
              Tell us about your gaming habits, and our AI will suggest some project ideas you might like to build!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectSuggester />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
