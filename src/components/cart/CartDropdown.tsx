'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, X, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { formatPrice } from '@/lib/cart-utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function CartDropdown() {
  const { 
    cart, 
    status, 
    totalItems, 
    totalAmount,
    removeItem,
    updateQuantity 
  } = useCart()

  // State para controlar el Sheet (drawer) en móvil
  const [isOpen, setIsOpen] = useState(false)

  // Si no hay carrito o está cargando, mostramos el botón deshabilitado
  if (!cart || status === 'loading') {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 md:h-12 md:w-12 relative"
        disabled
      >
        <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          0
        </span>
      </Button>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 md:h-12 md:w-12 relative"
        >
          <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Carrito de Compras</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-1">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mb-4" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  {/* Imagen del producto */}
                  <div className="h-24 w-24 rounded-md border overflow-hidden">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Detalles del producto */}
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.priceAtPurchase)}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, Math.min(10, item.quantity + 1))}
                        disabled={item.quantity >= 10}
                      >
                        +
                      </Button>
                    </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal del item */}
                  <div className="w-20 text-right">
                    <p className="font-medium">
                      {formatPrice(item.priceAtPurchase * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-6 bg-background">
          <Separator className="mb-4" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-lg">
                {formatPrice(totalAmount)}
              </span>
            </div>
            
            <Button 
              className="w-full"
              size="lg"
              disabled={cart.items.length === 0}
              onClick={() => setIsOpen(false)}
              asChild
            >
              <Link href="/cart">
                Finalizar Compra
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}