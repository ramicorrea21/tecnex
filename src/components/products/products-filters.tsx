import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategories } from '@/hooks/use-categories'
import type { ProductFilters } from '@/types/product'

interface ProductsFiltersProps {
  onFiltersChange: (filters: ProductFilters) => void
}

export function ProductsFilters({ onFiltersChange }: ProductsFiltersProps) {
  const { categories } = useCategories()
  const [filters, setFilters] = useState<ProductFilters>({})

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters }
      onFiltersChange(updated)
      return updated
    })
  }

  return (
    <div className="space-y-4 md:space-y-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Input
          placeholder="Buscar productos..."
          className="w-full"
          value={filters.search || ''}
          onChange={(e) => updateFilters({ search: e.target.value })}
        />
        
        <Select
          value={filters.category || "all"}
          onValueChange={(value) => updateFilters({ 
            category: value === "all" ? undefined : value 
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.active === undefined ? "all" : filters.active.toString()}
          onValueChange={(value) => updateFilters({ 
            active: value === "all" ? undefined : value === "true" 
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="true">Activos</SelectItem>
            <SelectItem value="false">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.inStock === undefined ? "all" : filters.inStock.toString()}
          onValueChange={(value) => updateFilters({ 
            inStock: value === "all" ? undefined : value === "true"
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo el stock</SelectItem>
            <SelectItem value="true">En stock</SelectItem>
            <SelectItem value="false">Sin stock</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline"
          onClick={() => {
            setFilters({})
            onFiltersChange({})
          }}
          className="w-full"
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  )
}