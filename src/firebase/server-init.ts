
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
    // We catch it gracefully to allow the app to build without crashing.
    if (error.code === '2 UNKNOWN' || error.message.includes('Could not refresh access token') || error.message.includes('credential')) {
        console.warn(`Could not fetch site settings due to auth error. This is expected during local development if service account credentials aren't configured. Using default metadata. Error: ${error.message}`);
        return null;
    }
    console.error('Error fetching site settings:', error);
    // In case of other errors (e.g., permissions), return null to allow fallback values
    return null;
  }
}
