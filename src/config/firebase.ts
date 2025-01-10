import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  try {
    console.log('Iniciando conexión con emuladores...');
    
    const authHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
    console.log('Auth Host:', authHost);
    
    connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true });
    console.log('Auth emulator conectado');
    
    const firestoreHost = 'localhost';
    const firestorePort = 8080;
    connectFirestoreEmulator(db, firestoreHost, firestorePort);
    console.log('Firestore emulator conectado');
    
    const storageHost = 'localhost';
    const storagePort = 9199;
    connectStorageEmulator(storage, storageHost, storagePort);
    console.log('Storage emulator conectado');
    
  } catch (error) {
    console.error('Error conectando a emuladores:', error);
  }
}

export { app, auth, db, storage };