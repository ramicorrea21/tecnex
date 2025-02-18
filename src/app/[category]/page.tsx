'use client'

import { use } from "react"
import { useProducts } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/store/MainNav"
import { CategoryNav } from "@/components/store/CategoryNav"
import Link from "next/link"

function ProductGrid({ categorySlug }: { categorySlug: string }) {
  const { products, loading: productsLoading, error: productsError } = useProducts()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()

  // Normalizar el slug: convertir espacios a guiones y asegurar que termine en guión
  const normalizedSlug = categorySlug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') + (categorySlug.endsWith('-') ? '' : '-')
  
  // Encontrar el ID de la categoría basado en el slug normalizado
  const category = categories.find(cat => cat.slug === normalizedSlug)
  const categoryId = category?.id

  // Filtramos los productos que coincidan con la categoría actual
  const categoryProducts = products.filter(product => product.categoryId === categoryId)

  if (productsError || categoriesError) {
    return <div className="text-red-500">{productsError || categoriesError}</div>
  }

  if (productsLoading || categoriesLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          Categoría no encontrada: {normalizedSlug}
        </p>
      </div>
    )
  }

  if (categoryProducts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No hay productos en esta categoría</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categoryProducts.map((product) => (
        <Link 
          key={product.id} 
          href={`/${categorySlug}/${product.slug}`}
          className="block group"
        >
          <Card className="overflow-hidden transition-transform duration-200 group-hover:scale-[1.02]">
            <div className="relative h-48">
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
            <CardContent className="p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold">
                  ${product.price.toLocaleString()}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.comparePrice.toLocaleString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = use(params)
  const decodedCategory = decodeURIComponent(category).trim()
  
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <CategoryNav />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ScrollArea className="h-full">
            <h1 className="text-2xl font-bold mb-6">
              {decodedCategory}
            </h1>
            <ProductGrid categorySlug={decodedCategory} />
          </ScrollArea>
        </div>
      </main>
    </div>
  )
}