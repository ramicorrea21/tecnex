'use client';

import { useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function TestFirebase() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const docRef = await addDoc(collection(db, 'test'), {
          message: 'Hello from Next.js!',
          timestamp: new Date()
        });
        console.log('Document written with ID: ', docRef.id);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center sm:items-start">
      <h2 className="text-xl font-bold">Firebase Test Component</h2>
      <p className="text-sm font-[family-name:var(--font-geist-mono)]">
        Check the console for connection results
      </p>
    </div>
  );
}