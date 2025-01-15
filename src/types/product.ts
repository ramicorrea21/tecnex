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
  brand: string           // Added brand field
  active: boolean
  featured: boolean      
  createdAt: Date
  updatedAt: Date
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  categoryId: string
  brand: string           // Added brand field
  active: boolean
  featured: boolean
  images?: File[]          
  existingImages?: string[] 
}

export interface ProductFilters {
  category?: string
  brand?: string          // Added brand filter
  search?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  active?: boolean
  featured?: boolean
}