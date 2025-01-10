export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CategoryFormData {
  name: string
  description?: string
  active: boolean
}