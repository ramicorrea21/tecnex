'use client'

import { use } from "react"
import { useProducts } from "@/hooks/use-products"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MainNav } from "@/components/store/MainNav"
import { CategoryNav } from "@/components/store/CategoryNav"

function ProductDetail({ productSlug }: { productSlug: string }) {
  const { products, loading, error } = useProducts()
  
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

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Stock:</span>
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `${product.stock} unidades` : 'Sin stock'}
            </span>
          </div>
        </div>

        <Button size="lg" className="w-full" disabled={product.stock === 0}>
          {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
        </Button>
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