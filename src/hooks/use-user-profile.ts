'use client';

import { useDoc } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { doc, DocumentReference } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { useEffect, useState } from 'react';

export function useUserProfile(uid: string | undefined) {
  const firestore = useFirestore();
  const [currentUid, setCurrentUid] = useState(uid);

  const docRef = useMemoFirebase(
    () => (firestore && uid ? doc(firestore, 'users', uid) : null),
    [firestore, uid]
  );
  
  const { data, isLoading: isDocLoading, error } = useDoc<UserProfile>(docRef as DocumentReference<UserProfile> | null);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // When the incoming UID changes, we are definitely in a loading state.
    // We set our internal loading flag to true immediately.
    if (uid !== currentUid) {
      setCurrentUid(uid);
      setIsLoading(true);
    } else {
      // Otherwise, our loading state is just whatever the useDoc hook reports.
      setIsLoading(isDocLoading);
    }
  }, [uid, isDocLoading, currentUid]);


  return { userProfile: data, isLoading, error };
}
