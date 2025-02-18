// src/app/admin/dashboard/orders/page.tsx
'use client'

import { useState, useCallback } from 'react'
import { useOrders } from '@/hooks/use-orders'
import { OrderStatus } from '@/types/order'
import type { OrderFilters } from '@/types/orders-filters'
import { OrderDetails } from '@/components/orders/OrderDetails'
import { updateOrderStatus } from '@/lib/firebase/orders'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatPrice } from '@/lib/cart-utils'

const PAYMENT_STATUSES = ['pending', 'approved', 'rejected'] as const

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

function PaymentStatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status.toUpperCase()}
        </span>
    )
}

export default function OrdersPage() {
    const [currentFilters, setCurrentFilters] = useState<OrderFilters>({})
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    
    const handleFilterChange = useCallback((newFilters: Partial<OrderFilters>) => {
      setCurrentFilters(prev => ({
        ...prev,
        ...newFilters
      }))
    }, [])
  
    const { 
      orders, 
      isLoading, 
      error, 
      hasMore, 
      loadMore,
      refresh  // Añadimos refresh aquí
    } = useOrders(currentFilters)
  
    const handleUpdateStatus = async (status: OrderStatus) => {
      if (!selectedOrderId) return
      
      try {
        await updateOrderStatus(selectedOrderId, { status })
        await refresh() // Ahora podemos usar refresh
      } catch (error) {
        console.error('Error updating order status:', error)
      }
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
                    <CardContent className="text-red-500 p-4">
                        Error al cargar las órdenes: {error.message}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Órdenes</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Filtros */}
                    <div className="mb-6 flex gap-4">
                        <Select
                            value={currentFilters.status || 'all'}
                            onValueChange={(value) =>
                                handleFilterChange({
                                    status: value === 'all' ? undefined : value as OrderStatus
                                })
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Estado de Orden" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                {Object.values(OrderStatus).map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={currentFilters.paymentStatus || 'all'}
                            onValueChange={(value) =>
                                handleFilterChange({
                                    paymentStatus: value === 'all' ? undefined : value as 'pending' | 'approved' | 'rejected'
                                })
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Estado de Pago" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los pagos</SelectItem>
                                {PAYMENT_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tabla */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Estado Orden</TableHead>
                                    <TableHead>Estado Pago</TableHead>
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
                                            {order.createdAt.toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{order.customerId}</TableCell>
                                        <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                                        <TableCell>
                                            <OrderStatusBadge status={order.status} />
                                        </TableCell>
                                        <TableCell>
                                            <PaymentStatusBadge status={order.paymentStatus} />
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
                            </TableBody>
                        </Table>
                    </div>

                    {/* Botón Cargar Más */}
                    {hasMore && (
                        <div className="mt-4 text-center">
                            <Button
                                variant="outline"
                                onClick={() => loadMore()}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Cargando...' : 'Cargar más'}
                            </Button>
                        </div>
                    )}
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