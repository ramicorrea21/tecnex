'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('AuthGuard effect - loading:', loading, 'user:', user)
    if (!loading && !user) {
      console.log('Redirecting to login')
      router.push('/admin/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    console.log('AuthGuard loading')
    return <div>Cargando...</div>
  }

  console.log('AuthGuard render - user:', user)
  return user ? <>{children}</> : null
}