
import "server-only";

import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';
import type { SiteSettings } from '@/lib/types';

// Important: This file should only be used in server-side code.

function initializeFirebaseAdmin() {
  if (!getApps().length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('ascii')
      );
      initializeApp({
        credential: cert(serviceAccount),
        projectId: firebaseConfig.projectId,
      });
    } else {
      // For local development without service account key
      // This will cause errors if you try to access auth-protected resources, but allows the app to start
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY not found. Initializing with default credentials. Firestore access may be limited.");
      initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
  }
  return getApp();
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
    // During local development, if service account isn't set, this will fail.
    // We catch it gracefully to allow the app to build without crashing.
    if (error.code === '2 UNKNOWN' || error.message.includes('Could not refresh access token')) {
        console.warn('Could not fetch site settings. This is expected during local development if a service account key is not provided. Using default metadata.');
        return null;
    }
    console.error('Error fetching site settings:', error);
    // In case of other errors (e.g., permissions), return null to allow fallback values
    return null;
  }
}
