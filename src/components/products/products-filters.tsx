import { useState, useEffect } from 'react'
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
import type { Product, ProductFilters } from '@/types/product'

interface ProductsFiltersProps {
  onFiltersChange: (filters: ProductFilters) => void
  products: Product[]
}

export function ProductsFilters({ onFiltersChange, products }: ProductsFiltersProps) {
  const { categories, loading: categoriesLoading } = useCategories()
  const [localFilters, setLocalFilters] = useState<ProductFilters>({})
  const [uniqueBrands, setUniqueBrands] = useState<string[]>([])

  useEffect(() => {
    if (products && products.length > 0) {
      const brands = Array.from(new Set(
        products
          .map(p => p.brand)
          .filter((brand): brand is string => brand != null && brand !== '')
      )).sort((a, b) => a.localeCompare(b))

      console.log('Available brands:', brands) // Debug log
      setUniqueBrands(brands)
    }
  }, [products])

  useEffect(() => {
    console.log('Categories loaded:', categories) // Debug log
  }, [categories])

  // Propagar cambios de filtros al padre
  useEffect(() => {
    onFiltersChange(localFilters)
  }, [localFilters, onFiltersChange])

  const handleSearchChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      search: value || undefined
    }))
  }

  const handleCategoryChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      category: value === "all" ? undefined : value
    }))
  }

  const handleBrandChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      brand: value === "all" ? undefined : value
    }))
  }

  const handleActiveChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      active: value === "all" ? undefined : value === "true"
    }))
  }

  const handleStockChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      inStock: value === "all" ? undefined : value === "true"
    }))
  }

  const clearFilters = () => {
    setLocalFilters({})
  }

  return (
    <div className="space-y-4 md:space-y-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
        <Input
          placeholder="Buscar productos..."
          className="w-full"
          value={localFilters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        
        <Select
          value={localFilters.category || "all"}
          onValueChange={handleCategoryChange}
          disabled={categoriesLoading || categories.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={categoriesLoading ? "Cargando..." : "Categoría"} />
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
          value={localFilters.brand || "all"}
          onValueChange={handleBrandChange}
          disabled={uniqueBrands.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {uniqueBrands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={localFilters.active === undefined ? "all" : String(localFilters.active)}
          onValueChange={handleActiveChange}
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
          value={localFilters.inStock === undefined ? "all" : String(localFilters.inStock)}
          onValueChange={handleStockChange}
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
          onClick={clearFilters}
          className="w-full"
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  )
}