'use client'

import { useState } from 'react'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Sidebar } from '@/components/layout/admin/sidebar'
import { Header } from '@/components/layout/admin/header'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="flex h-screen">
        <Sidebar 
          className="w-64 hidden md:block" 
          showMobile={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}