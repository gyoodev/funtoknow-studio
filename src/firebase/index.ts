'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

/**
 * Initializes the Firebase app, creating it if it doesn't already exist.
 * This function is safe to call multiple times.
 * @returns An object containing the initialized Firebase services.
 */
export function initializeFirebase() {
  if (getApps().length) {
    // If already initialized, return the SDKs with the existing app instance.
    return getSdks(getApp());
  }

  // Initialize the Firebase app with the provided configuration.
  const firebaseApp = initializeApp(firebaseConfig);
  return getSdks(firebaseApp);
}

/**
 * A helper function to get all the necessary Firebase SDK instances from a FirebaseApp.
 * @param firebaseApp The initialized FirebaseApp instance.
 * @returns An object containing the Auth and Firestore SDKs.
 */
export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';