
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
  } catch (error) {
    console.error('Error fetching site settings:', error);
    // In case of error (e.g., permissions), return null to allow fallback values
    return null;
  }
}
