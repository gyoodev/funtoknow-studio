'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { SiteSettings } from '@/lib/types';
import { doc, DocumentReference } from 'firebase/firestore';

export function useSiteSettings() {
  const firestore = useFirestore();
  const settingsRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'settings', 'global') : null),
    [firestore]
  );

  const { data: settings, isLoading, error } = useDoc<SiteSettings>(settingsRef as DocumentReference<SiteSettings> | null);

  return { settings, isLoading, error };
}

    