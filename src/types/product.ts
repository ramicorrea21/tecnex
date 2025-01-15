import type { Category } from './category'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number   
  stock: number
  images: string[]         
  categoryId: string       
  active: boolean
  featured: boolean      
  createdAt: Date
  updatedAt: Date
}

export interface ProductFormData {
  name: string
  description: string
  price: number | undefined
  comparePrice?: number
  stock: number | undefined
  categoryId: string
  active: boolean
  featured: boolean
  images?: File[]          
  existingImages?: string[] 
}

export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  active?: boolean
  featured?: boolean
}