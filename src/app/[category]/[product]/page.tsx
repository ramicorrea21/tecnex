'use client'

import { useState } from "react"
import { use } from "react"
import { useProducts } from "@/hooks/use-products"
import { useCart } from "@/contexts/cart-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MainNav } from "@/components/store/MainNav"
import { CategoryNav } from "@/components/store/CategoryNav"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function ProductDetail({ productSlug }: { productSlug: string }) {
  const { products, loading, error } = useProducts()
  const { addItem, MAX_QUANTITY_PER_ITEM } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  
  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-96 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    )
  }

  const product = products.find(p => p.slug === productSlug)

  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Producto no encontrado</p>
      </div>
    )
  }

  // Manejar el agregar al carrito
  const handleAddToCart = async () => {
    try {
      setIsAdding(true)
      await addItem(product, quantity)
      setQuantity(1) // Reset quantity after adding
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Imagen del producto */}
      <Card className="overflow-hidden">
        <div className="relative aspect-square">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {!product.active && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              Inactivo
            </Badge>
          )}
          {product.featured && (
            <Badge className="absolute top-2 left-2" variant="default">
              Destacado
            </Badge>
          )}
        </div>
      </Card>

      {/* Información del producto */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-muted-foreground">{product.brand}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            ${product.price.toLocaleString()}
          </span>
          {product.comparePrice && (
            <span className="text-xl text-muted-foreground line-through">
              ${product.comparePrice.toLocaleString()}
            </span>
          )}
        </div>

        <p className="text-muted-foreground whitespace-pre-wrap">
          {product.description}
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Stock:</span>
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `${product.stock} unidades` : 'Sin stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <Select
                value={quantity.toString()}
                onValueChange={(value) => setQuantity(Number(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Cantidad" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: Math.min(product.stock, MAX_QUANTITY_PER_ITEM) }, 
                    (_, i) => i + 1
                  ).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                size="lg" 
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
              >
                {isAdding ? 'Agregando...' : 'Agregar al carrito'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ product: string }>
}) {
  const { product } = use(params)
  const decodedProduct = decodeURIComponent(product).trim()
  
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <CategoryNav />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductDetail productSlug={decodedProduct} />
        </div>
      </main>
    </div>
  )
}