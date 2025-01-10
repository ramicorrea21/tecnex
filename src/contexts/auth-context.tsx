'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User, AuthContextType } from '@/types/auth'
import { auth } from '@/config/firebase'
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          isAdmin: true
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Intentando login con:', email);
      console.log('Estado actual de auth:', auth);
      console.log('Configuración de emulador:', (auth as any)._config);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login exitoso:', result.user);
    } catch (error: any) {
      console.error('Error detallado:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}