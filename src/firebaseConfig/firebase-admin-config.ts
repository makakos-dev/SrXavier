import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { serverEnv } from '@/lib/env/server';

const firebaseAdminConfig = {
  credential: cert({
    projectId: serverEnv.FIREBASE_PROJECT_ID,
    clientEmail: serverEnv.FIREBASE_CLIENT_EMAIL,
    privateKey: serverEnv.FIREBASE_PRIVATE_KEY
      ? serverEnv.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined,
  }),
};

export const initApp = () => (!getApps().length ? initializeApp(firebaseAdminConfig) : getApp());
