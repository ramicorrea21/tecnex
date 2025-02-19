// src/app/admin/dashboard/orders/page.tsx
'use client'

import { useState } from 'react'
import { useOrders } from '@/hooks/use-orders'
import { OrderStatus } from '@/types/order'
import { updateOrderStatus } from '@/lib/firebase/orders'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from '@/lib/cart-utils'
import { OrderDetails } from '@/components/orders/OrderDetails'

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const { orders, isLoading, error, refresh } = useOrders()

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    // Cerrar modal primero
    setSelectedOrderId(null)
    
    // Luego actualizar en background
    updateOrderStatus(orderId, {
      status: newStatus,
      note: `Estado actualizado a ${newStatus}`
    })
    .then(() => {
      // Esperar un poco y refrescar
      setTimeout(() => {
        refresh()
      }, 500)
      
      // Enviar email (sin bloquear)
      fetch('/api/email', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({orderId, status: newStatus})
      }).catch(err => console.error('Email error:', err))
    })
    .catch(err => {
      console.error('Update error:', err)
      alert('Error al actualizar: ' + err.message)
    })
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-4 text-red-500">
            Error: {error.message}
            <Button onClick={refresh} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Órdenes ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {order.createdAt?.toLocaleDateString() || 'N/A'}
                    </TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No hay órdenes para mostrar
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <Button onClick={refresh} className="mt-4" variant="outline">
            Actualizar datos
          </Button>
        </CardContent>
      </Card>

      <OrderDetails 
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}

// Badge de estado
function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAYMENT_CONFIRMED:
        return 'bg-green-100 text-green-800'
      case OrderStatus.PENDING_PAYMENT:
        return 'bg-yellow-100 text-yellow-800'
      case OrderStatus.IN_TRANSIT:
        return 'bg-blue-100 text-blue-800'
      case OrderStatus.DELIVERED:
        return 'bg-purple-100 text-purple-800'
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  )
}