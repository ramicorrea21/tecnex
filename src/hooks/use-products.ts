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
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({})

  const applyFilters = useCallback((products: Product[], currentFilters: ProductFilters) => {
    return products.filter(product => {
      // Filtro por búsqueda
      if (currentFilters.search && currentFilters.search.trim() !== '') {
        const searchTerm = currentFilters.search.toLowerCase()
        const matchesName = product.name.toLowerCase().includes(searchTerm)
        const matchesBrand = product.brand?.toLowerCase().includes(searchTerm) || false
        if (!matchesName && !matchesBrand) return false
      }

      // Filtro por categoría
      if (currentFilters.category && product.categoryId !== currentFilters.category) {
        return false
      }

      // Filtro por marca
      if (currentFilters.brand && product.brand !== currentFilters.brand) {
        return false
      }

      // Filtro por estado (activo/inactivo)
      if (typeof currentFilters.active === 'boolean' && product.active !== currentFilters.active) {
        return false
      }

      // Filtro por stock
      if (typeof currentFilters.inStock === 'boolean') {
        const hasStock = product.stock > 0
        if (currentFilters.inStock !== hasStock) return false
      }

      return true
    })
  }, [])

  // Cargar productos solo una vez al montar el componente
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getProducts()
        setAllProducts(data)
        setFilteredProducts(data) // Inicialmente mostramos todos los productos
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Error al cargar los productos')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, []) // Sin dependencias para cargar solo al montar

  // Aplicar filtros cuando cambien los filtros o los productos
  useEffect(() => {
    setFilteredProducts(applyFilters(allProducts, filters))
  }, [filters, allProducts, applyFilters])

  // Crear producto
  const create = async (data: ProductFormData) => {
    try {
      setLoading(true)
      const id = await createProduct(data)
      const updatedProducts = await getProducts()
      setAllProducts(updatedProducts)
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
      const updatedProducts = await getProducts()
      setAllProducts(updatedProducts)
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
      const updatedProducts = await getProducts()
      setAllProducts(updatedProducts)
    } catch (err) {
      console.error('Error deleting product:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters)
  }, [])

  return {
    products: filteredProducts,
    allProducts,
    loading,
    error,
    filters,
    updateFilters,
    create,
    update,
    remove
  }
}