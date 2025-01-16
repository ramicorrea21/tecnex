'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/hooks/use-categories" 
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryNav() {
  const { categories, loading, error } = useCategories()

  // Loading state
  if (loading) {
    return (
      <div className="relative border-b bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-center">
            <div className="flex items-center overflow-x-auto w-full">
              <span className="flex-none text-sm font-medium text-foreground/60 px-4">
                Categorías
              </span>
              <div className="flex items-center gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-8 w-24" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="relative border-b bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-center">
            <p className="text-sm text-destructive">Error al cargar las categorías</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative border-b bg-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-center">
          <div className="flex items-center overflow-x-auto w-full">
            <span className="flex-none text-sm font-medium text-foreground/60 px-4">
              Categorías
            </span>
            <ul className="flex items-center gap-6 flex-nowrap">
              {categories.map((category) => (
                <li key={category.id} className="flex-none">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}