'use client'

import { use } from "react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
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

function ProductGrid({ categorySlug, brandFilter }: { categorySlug: string, brandFilter?: string }) {
  const { products, loading: productsLoading, error: productsError, updateFilters } = useProducts()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])

  // Normalizar el slug: convertir espacios a guiones y asegurar que termine en guión
  const normalizedSlug = categorySlug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') + (categorySlug.endsWith('-') ? '' : '-')
  
  // Encontrar el ID de la categoría basado en el slug normalizado
  const category = categories.find(cat => cat.slug === normalizedSlug)
  const categoryId = category?.id

  // Filtrar productos cuando cambian los parámetros
  useEffect(() => {
    if (!categoryId) return

    // Actualizar los filtros para los hooks internos
    const filters = {
      category: categoryId,
      ...(brandFilter ? { brand: brandFilter } : {})
    }
    
    updateFilters(filters)
  }, [categoryId, brandFilter, updateFilters])

  // Renderizar el estado de carga
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

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          {brandFilter 
            ? `No hay productos de la marca ${brandFilter} en esta categoría` 
            : 'No hay productos en esta categoría'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
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
  const searchParams = useSearchParams()
  const brandFilter = searchParams.get('brand')
  const decodedCategory = decodeURIComponent(category).trim()
  
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <CategoryNav />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ScrollArea className="h-full">
            <div className="flex items-baseline justify-between mb-6">
              <h1 className="text-2xl font-bold">
                {decodedCategory}
              </h1>
              {brandFilter && (
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Filtrado por:</span>
                  <Badge variant="outline" className="bg-blue-50">
                    {brandFilter}
                  </Badge>
                </div>
              )}
            </div>
            <ProductGrid 
              categorySlug={decodedCategory} 
              brandFilter={brandFilter || undefined} 
            />
          </ScrollArea>
        </div>
      </main>
    </div>
  )
}