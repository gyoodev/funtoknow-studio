
import "server-only";

import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';
import type { SiteSettings } from '@/lib/types';

// Important: This file should only be used in server-side code.

function initializeFirebaseAdmin(): App {
  if (getApps().length) {
    return getApp();
  }

  // When deployed to Firebase App Hosting, the service account credentials
  // are automatically provided via environment variables.
  // The `credential` property will be populated by the SDK.
  // In a local environment, you would need to set the GOOGLE_APPLICATION_CREDENTIALS
  // environment variable to point to your service account key file.
  return initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

/**
 * Gets the Firestore database instance.
 * Ensures the app is initialized.
 */
export function getDb() {
  initializeFirebaseAdmin();
  return getFirestore();
}

/**
 * Fetches the global site settings from Firestore.
 * This is a server-side function.
 * @returns {Promise<SiteSettings | null>} The site settings or null if not found.
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const db = getDb();
    const settingsDoc = await db.collection('settings').doc('global').get();

    if (!settingsDoc.exists) {
      console.warn('Site settings not found in Firestore.');
      return null;
    }

    return settingsDoc.data() as SiteSettings;
  } catch (error: any) {
    // This can happen in local development if GOOGLE_APPLICATION_CREDENTIALS is not set.
    // It can also happen in production due to transient errors.
    // We catch it gracefully to allow the app to build/render without crashing.
    console.error(`Could not fetch site settings. This might be expected during local dev if credentials aren't set. Error: ${error.message}`);
    // In case of any error, return null to allow fallback values.
    return null;
  }
}
