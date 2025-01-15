'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProductImagesUpload } from './product-images-upload'
import { useCategories } from '@/hooks/use-categories'
import type { Product, ProductFormData } from '@/types/product'

interface ProductFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData) => Promise<void>
  product?: Product
}

export function ProductForm({ 
  open, 
  onClose, 
  onSubmit, 
  product 
}: ProductFormProps) {
  const { categories, fetchCategories } = useCategories()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price,
    comparePrice: product?.comparePrice,
    stock: product?.stock,
    categoryId: product?.categoryId || '',
    active: product?.active ?? true,
    featured: product?.featured ?? false,
    existingImages: product?.images || [],
    images: []
  })

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        stock: product.stock,
        categoryId: product.categoryId,
        active: product.active,
        featured: product.featured,
        existingImages: product.images || [],
        images: []
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      console.log('Submitting form data:', formData)
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !loading && !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                required
                disabled={loading}
              />
            </div>
            
            <div className="col-span-2">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Precio</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  price: e.target.value ? parseFloat(e.target.value) : undefined
                }))}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Precio anterior</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.comparePrice || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  comparePrice: e.target.value ? parseFloat(e.target.value) : undefined
                }))}
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Stock</label>
              <Input
                type="number"
                min="0"
                value={formData.stock || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  stock: e.target.value ? parseInt(e.target.value) : undefined
                }))}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Categoría</label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  categoryId: value
                }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Imágenes */}
          <div>
            <label className="text-sm font-medium">Imágenes</label>
            <ProductImagesUpload
              existingImages={formData.existingImages}
              onImagesChange={(files, existing) => setFormData(prev => ({
                ...prev,
                images: files,
                existingImages: existing
              }))}
              disabled={loading}
            />
          </div>

          {/* Opciones */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  active: checked as boolean
                }))}
                disabled={loading}
              />
              <label htmlFor="active" className="text-sm font-medium">
                Producto activo
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  featured: checked as boolean
                }))}
                disabled={loading}
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Producto destacado
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : product ? 'Guardar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}