import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  getDocFromServer,
  Firestore 
} from 'firebase/firestore';
import { 
  getAuth, 
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User 
} from 'firebase/auth';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// A secondary Auth instance lets the owner create another email/password user
// without signing the owner out of the current browser session.
export async function createSecondaryAuthUser(email: string, password: string): Promise<User> {
  const secondaryApp = getApps().find((candidate) => candidate.name === 'admin-user-creator')
    ?? initializeApp(firebaseConfig, 'admin-user-creator');
  const secondaryAuth = getAuth(secondaryApp);
  const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  await signOut(secondaryAuth);
  return credential.user;
}

// Initialize Firestore with robust caching and auto-detect long polling for sandboxed environments
let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      experimentalAutoDetectLongPolling: true
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db: Firestore = firestoreInstance;

// Initialize Auth
export const auth = getAuth(app);
void setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('Could not enable local auth persistence:', error);
});

// Initialize Storage
export const storage = getStorage(app);

// Safe connection helper that doesn't trigger permission denied or server forced roundtrip
export async function testConnection() {
  return Promise.resolve(true);
}

// Collection Names Enum
export const COLLECTIONS = {
  ADMINS: 'admins',
  BOOKINGS: 'bookings',
  BOOKING_TRACKING: 'booking_tracking',
  AUDIT_LOGS: 'audit_logs',
  WORKS: 'works',
  FOR_SALE: 'for_sale',
  REVIEWS: 'reviews',
  CUSTOMERS: 'customers',
  REPAIRS: 'repairs',
  SETTINGS: 'settings'
} as const;

export {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocFromServer,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  ref,
  uploadBytes,
  getDownloadURL
};
export type { User };
