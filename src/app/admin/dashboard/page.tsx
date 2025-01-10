'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  console.log('Rendering admin dashboard')
  const { user, signOut } = useAuth()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-4">Bienvenido, {user?.email}</p>
      <Button onClick={signOut}>Cerrar sesión</Button>
    </div>
  )
}