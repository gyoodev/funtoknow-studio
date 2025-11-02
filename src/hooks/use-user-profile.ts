'use client';

import { useDoc } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { doc, DocumentReference } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';

export function useUserProfile(uid: string | undefined) {
  const firestore = useFirestore();
  const docRef = useMemoFirebase(
    () => (firestore && uid ? doc(firestore, 'users', uid) : null),
    [firestore, uid]
  );
  
  const { data, isLoading, error } = useDoc<UserProfile>(docRef as DocumentReference<UserProfile> | null);

  return { userProfile: data, isLoading, error };
}
