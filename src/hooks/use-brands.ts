'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProducts } from './use-products'

export function useBrands() {
  const { allProducts, loading: productsLoading } = useProducts()
  const [brandsByCategory, setBrandsByCategory] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get all unique brands
  const getAllBrands = useCallback(() => {
    const allBrands = allProducts
      .map(product => product.brand)
      .filter((brand): brand is string => 
        brand !== undefined && brand !== null && brand !== ''
      )
    
    return [...new Set(allBrands)].sort()
  }, [allProducts])

  // Get brands for a specific category
  const getBrandsForCategory = useCallback((categoryId: string) => {
    if (!categoryId) return []
    
    const brands = allProducts
      .filter(product => product.categoryId === categoryId)
      .map(product => product.brand)
      .filter((brand): brand is string => 
        brand !== undefined && brand !== null && brand !== ''
      )
    
    return [...new Set(brands)].sort()
  }, [allProducts])

  // Build the brands by category mapping
  useEffect(() => {
    if (productsLoading) return
    
    try {
      setLoading(true)
      const result: Record<string, string[]> = {}
      
      // Get unique categoryIds
      const categoryIds = [...new Set(allProducts.map(p => p.categoryId))]
      
      // For each category, get the brands
      categoryIds.forEach(categoryId => {
        if (categoryId) {
          result[categoryId] = getBrandsForCategory(categoryId)
        }
      })
      
      setBrandsByCategory(result)
    } catch (err) {
      console.error('Error processing brands data:', err)
      setError('Error al procesar las marcas')
    } finally {
      setLoading(false)
    }
  }, [allProducts, productsLoading, getBrandsForCategory])

  return {
    brandsByCategory,
    getAllBrands,
    getBrandsForCategory,
    loading: loading || productsLoading,
    error
  }
}