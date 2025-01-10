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

// Connect to emulators only in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Iniciando conexión con emuladores...');
  
  try {
    const authHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
    const firestoreHost = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST?.split(':')[0] || 'localhost';
    const firestorePort = parseInt(process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST?.split(':')[1] || '8080');
    const storageHost = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_HOST?.split(':')[0] || 'localhost';
    const storagePort = parseInt(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_HOST?.split(':')[1] || '9199');

    connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true });
    connectFirestoreEmulator(db, firestoreHost, firestorePort);
    connectStorageEmulator(storage, storageHost, storagePort);
    
    console.log('✅ Emuladores conectados exitosamente');
  } catch (error) {
    console.error('❌ Error conectando emuladores:', error);
  }
} else {
  console.log('🚀 Usando Firebase Producción');
}

export { app, auth, db, storage };