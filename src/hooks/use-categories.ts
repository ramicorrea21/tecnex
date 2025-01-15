'use client'

import { useState, useCallback, useEffect } from 'react'
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '@/lib/firebase/categories'
import type { Category, CategoryFormData } from '@/types/category'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true) // Inicialmente true
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCategories()
      console.log('Fetched categories:', data) // Debug log
      setCategories(data)
    } catch (err) {
      setError('Error al cargar las categorías')
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar categorías automáticamente al montar
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const create = useCallback(async (data: CategoryFormData) => {
    try {
      setLoading(true)
      setError(null)
      await createCategory(data)
      await fetchCategories() 
    } catch (err) {
      setError('Error al crear la categoría')
      console.error('Error creating category:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchCategories])

  const update = useCallback(async (id: string, data: CategoryFormData) => {
    try {
      setLoading(true)
      setError(null)
      await updateCategory(id, data)
      await fetchCategories() 
    } catch (err) {
      setError('Error al actualizar la categoría')
      console.error('Error updating category:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchCategories])

  const remove = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await deleteCategory(id)
      await fetchCategories() 
    } catch (err) {
      setError('Error al eliminar la categoría')
      console.error('Error deleting category:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    create,
    update,
    remove
  }
}