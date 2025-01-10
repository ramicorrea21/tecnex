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
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          className="w-64 hidden md:block border-r bg-white" 
          showMobile={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}