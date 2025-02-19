// src/components/orders/OrderDetails.tsx
import { useState } from 'react'
import { useOrderDetails } from '@/hooks/use-order-details'
import { OrderStatus } from '@/types/order'
import { formatPrice } from '@/lib/cart-utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

interface OrderDetailsProps {
  orderId: string | null
  onClose: () => void
  onUpdateStatus: (orderId: string, status: OrderStatus) => void
}

export function OrderDetails({ orderId, onClose, onUpdateStatus }: OrderDetailsProps) {
  const { order, customer, isLoading, error } = useOrderDetails(orderId)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null)

  if (!orderId) return null

  const handleUpdateClick = () => {
    if (!selectedStatus || !order) return
    onUpdateStatus(order.id, selectedStatus)
  }

  return (
    <Sheet open={!!orderId} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Detalles de la Orden</SheetTitle>
        </SheetHeader>

        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        )}

        {error && (
          <div className="p-4 text-red-500">
            {error.message}
          </div>
        )}

        {order && customer && (
          <ScrollArea className="h-[calc(100vh-80px)] pr-4">
            <div className="space-y-6 pt-4">
              {/* Estado actual */}
              <div className="space-y-2">
                <h3 className="font-medium">Estado actual: {order.status}</h3>
                <p className="text-sm text-muted-foreground">Selecciona un nuevo estado:</p>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.values(OrderStatus).map((status) => (
                    <Button
                      key={status}
                      variant={selectedStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStatus(status)}
                      className="justify-start"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
                
                {selectedStatus && (
                  <Button 
                    className="w-full mt-4"
                    onClick={handleUpdateClick}
                  >
                    Actualizar a {selectedStatus}
                  </Button>
                )}
              </div>

              <Separator />

              {/* Información del cliente */}
              <div className="space-y-2">
                <h3 className="font-medium">Cliente</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nombre</p>
                    <p>{customer.firstName} {customer.lastName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">DNI</p>
                    <p>{customer.dni}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p>{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Teléfono</p>
                    <p>{customer.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Dirección</p>
                    <p>{customer.street} {customer.streetNumber}, CP: {customer.zipCode}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Productos */}
              <div className="space-y-2">
                <h3 className="font-medium">Productos</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <p>{item.productId}</p>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.priceAtPurchase * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex justify-between font-medium">
                  <p>Total</p>
                  <p>{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  )
}