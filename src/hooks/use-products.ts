'use client'

import { useState, useCallback, useEffect } from 'react'
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '@/lib/firebase/products'
import type { Product, ProductFormData, ProductFilters } from '@/types/product'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({})

  const fetchProducts = useCallback(async (filters?: ProductFilters) => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching products with filters:', filters)
      const data = await getProducts(filters)
      console.log('Fetched products:', data)
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar productos automáticamente al montar
  useEffect(() => {
    fetchProducts(filters)
  }, [fetchProducts, filters])

  // Crear producto
  const create = async (data: ProductFormData) => {
    try {
      setLoading(true)
      console.log('Creating product with data:', data)
      const id = await createProduct(data)
      console.log('Product created with id:', id)
      await fetchProducts(filters)
      return id
    } catch (err) {
      console.error('Error creating product:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Actualizar producto
  const update = async (id: string, data: ProductFormData) => {
    try {
      setLoading(true)
      await updateProduct(id, data)
      await fetchProducts(filters)
    } catch (err) {
      console.error('Error updating product:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Eliminar producto
  const remove = async (id: string, imageUrls: string[]) => {
    try {
      setLoading(true)
      await deleteProduct(id, imageUrls)
      await fetchProducts(filters)
    } catch (err) {
      console.error('Error deleting product:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: ProductFilters) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters }
      return updated
    })
  }, [])

  return {
    products,
    loading,
    error,
    filters,
    fetchProducts,
    updateFilters,
    create,
    update,
    remove
  }
}