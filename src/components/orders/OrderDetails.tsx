// src/components/orders/OrderDetails.tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useOrderDetails } from "@/hooks/use-order-details"
import { OrderStatus } from "@/types/order"
import { formatPrice } from "@/lib/cart-utils"

interface OrderDetailsProps {
  orderId: string | null
  onClose: () => void
  onUpdateStatus: (status: OrderStatus) => Promise<void>
}

export function OrderDetails({ orderId, onClose, onUpdateStatus }: OrderDetailsProps) {
  const { order, customer, isLoading, error } = useOrderDetails(orderId)

  if (!orderId) return null

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
                <h3 className="font-medium">Estado actual</h3>
                <Select
                  value={order.status}
                  onValueChange={(value) => onUpdateStatus(value as OrderStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(OrderStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4">
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

              <Separator />

              {/* Historial de estados */}
              <div className="space-y-2">
                <h3 className="font-medium">Historial de estados</h3>
                <div className="space-y-2">
                  {order.statusHistory.map((history, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{history.status}</p>
                      <p className="text-muted-foreground">
                        {history.timestamp.toLocaleString()}
                      </p>
                      {history.note && (
                        <p className="text-muted-foreground">{history.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  )
}