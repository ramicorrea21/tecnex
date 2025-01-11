'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/use-products'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ProductsFilters } from '@/components/products/products-filters'
import { ProductsGrid } from '@/components/products/products-grid'
import { ProductForm } from '@/components/products/product-form'
import { DeleteCategoryAlert } from '@/components/categories/delete-category-alert' // Reutilizamos este componente
import type { Product, ProductFormData } from '@/types/product'

export default function ProductsPage() {
  const { products, loading, error, create, update, remove, updateFilters } = useProducts()
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

  const handleCreate = async (data: ProductFormData) => {
    await create(data)
    setFormOpen(false)
  }

  const handleUpdate = async (data: ProductFormData) => {
    if (selectedProduct) {
      await update(selectedProduct.id, data)
      setFormOpen(false)
      setSelectedProduct(undefined)
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (selectedProduct) {
      await remove(selectedProduct.id, selectedProduct.images)
      setDeleteOpen(false)
      setSelectedProduct(undefined)
    }
  }

  const openDelete = (product: Product) => {
    setSelectedProduct(product)
    setDeleteOpen(true)
  }

  if (loading) {
    return <div>Cargando productos...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <ProductsFilters onFiltersChange={updateFilters} />

      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No hay productos que coincidan con los filtros
        </div>
      ) : (
        <ProductsGrid
          products={products}
          onEdit={handleEdit}
          onDelete={openDelete}
        />
      )}

      <ProductForm 
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedProduct(undefined)
        }}
        onSubmit={selectedProduct ? handleUpdate : handleCreate}
        product={selectedProduct}
      />

      <DeleteCategoryAlert 
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setSelectedProduct(undefined)
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}