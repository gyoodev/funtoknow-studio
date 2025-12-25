'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@/components/ui/badge';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { format } from 'date-fns';
import { Preloader } from '@/components/preloader';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);
  const router = useRouter();
  const { toast } = useToast();
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [lastLogin, setLastLogin] = useState<Date | null>(null);

  const loading = isUserLoading || isProfileLoading;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && firestore) {
      const sessionRef = doc(firestore, 'sessions', user.uid);
      getDoc(sessionRef).then(sessionSnap => {
        if (sessionSnap.exists()) {
          const sessionData = sessionSnap.data();
          if (sessionData.createdAt) {
            setLastLogin(sessionData.createdAt.toDate());
          }
        }
      });
    }
  }, [user, firestore]);

  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast({
        title: 'Error',
        description: 'Could not send password reset email. Your email is not available.',
        variant: 'destructive',
      });
      return;
    }
    setIsSendingResetEmail(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your inbox to reset your password.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send password reset email.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-16 lg:py-24">
        <Preloader />
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

        <div className="grid gap-8 md:grid-cols-2">
           <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{userProfile.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{userProfile.email}</span>
              </div>
               <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'}>{userProfile.role}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last login:</span>
                <span className="font-medium">
                  {lastLogin ? format(lastLogin, "PPPp") : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handlePasswordReset} disabled={isSendingResetEmail}>
                {isSendingResetEmail && <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />}
                Send Password Reset Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
