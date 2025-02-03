'use client'

import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { formatPrice } from "@/lib/cart-utils"
import { MainNav } from "@/components/store/MainNav"
import { CategoryNav } from "@/components/store/CategoryNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CartPage() {
  const { 
    cart, 
    status, 
    totalItems,
    totalAmount,
    removeItem,
    updateQuantity,
    clearCart
  } = useCart()

  if (!cart || status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <CategoryNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <CategoryNav />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Carrito de Compras</h1>
              {cart.items.length > 0 && (
                <Button 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => clearCart()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Vaciar carrito
                </Button>
              )}
            </div>

            {cart.items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-xl font-medium">Tu carrito está vacío</p>
                  <p className="text-muted-foreground">
                    ¿No sabés qué comprar? ¡Miles de productos te esperan!
                  </p>
                </div>
                <Button asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a la tienda
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de productos */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.items.map((item) => (
                    <div 
                      key={item.productId}
                      className="flex gap-4 p-4 bg-card rounded-lg border"
                    >
                      {/* Imagen */}
                      <div className="h-24 w-24 rounded-md border overflow-hidden">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.product.brand}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            min="1"
                            max={Math.min(item.product.stock, 10)}
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value)
                              if (!isNaN(value) && value > 0) {
                                updateQuantity(item.productId, value)
                              }
                            }}
                            className="w-20"
                          />
                          <p className="font-medium">
                            {formatPrice(item.priceAtPurchase * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen */}
                <div className="lg:sticky lg:top-8 space-y-4">
                  <div className="p-6 bg-card rounded-lg border space-y-4">
                    <h3 className="text-lg font-medium">Resumen de compra</h3>
                    
                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Subtotal ({totalItems} productos)</span>
                        <span>{formatPrice(totalAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Envío</span>
                        <span className="text-green-600">Gratis</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between text-lg font-medium">
                      <span>Total</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full"
                      asChild
                    >
                      <Link href="/checkout">
                        Finalizar compra
                      </Link>
                    </Button>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    asChild
                  >
                    <Link href="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Seguir comprando
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}