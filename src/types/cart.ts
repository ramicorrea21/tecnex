import { Product } from './product'

export type CartStatus = 'idle' | 'loading' | 'error'

export interface CartItem {
  productId: string
  quantity: number
  addedAt: Date
  priceAtPurchase: number  
  product: Product         
}

export interface Cart {
  id: string              
  items: CartItem[]
  lastModified: Date      
  userId?: string        
}

export interface CartContextType {
  cart: Cart | null
  status: CartStatus
  error: string | null
  
  addItem: (product: Product, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  
  totalItems: number
  totalAmount: number
  
  MAX_QUANTITY_PER_ITEM: number  
  CART_EXPIRATION_HOURS: number  
}