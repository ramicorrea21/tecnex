// src/app/admin/dashboard/page.tsx
'use client'

import { Package, DollarSign, ShoppingCart, Badge } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen general del negocio
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Productos Activos"
          value="0"
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Categorías"
          value="0"
          icon={<Badge className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Ventas Totales"
          value="$0.00"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Órdenes Pendientes"
          value="0"
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    </div>
  )
}