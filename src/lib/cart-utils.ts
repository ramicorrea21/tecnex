import type { Cart, CartItem } from '@/types/cart'
import type { Product } from '@/types/product'

// Constantes
export const CART_STORAGE_KEY = 'cart_id'
export const MAX_QUANTITY_PER_ITEM = 10
export const CART_EXPIRATION_HOURS = 24

// Generar ID único para el carrito
export function generateCartId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Guardar ID del carrito en localStorage
export function saveCartId(cartId: string): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, cartId)
  } catch (error) {
    console.error('Error saving cart ID to localStorage:', error)
  }
}

// Obtener ID del carrito de localStorage
export function getStoredCartId(): string | null {
  try {
    return localStorage.getItem(CART_STORAGE_KEY)
  } catch (error) {
    console.error('Error getting cart ID from localStorage:', error)
    return null
  }
}

// Verificar si el carrito ha expirado
export function hasCartExpired(lastModified: Date): boolean {
  const now = new Date()
  const diffHours = (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60)
  return diffHours >= CART_EXPIRATION_HOURS
}

// Calcular total de items en el carrito
export function calculateTotalItems(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}

// Calcular monto total del carrito
export function calculateTotalAmount(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.priceAtPurchase * item.quantity), 0)
}

// Verificar si se puede agregar más cantidad de un producto
export function canAddMoreItems(currentQuantity: number, toAdd: number): boolean {
  return (currentQuantity + toAdd) <= MAX_QUANTITY_PER_ITEM
}

// Crear un nuevo CartItem a partir de un Product
export function createCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    quantity,
    addedAt: new Date(),
    priceAtPurchase: product.price,
    product
  }
}

// Limpiar datos del carrito del localStorage
export function clearStoredCart(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error)
  }
}

// Formatear precio para mostrar
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount)
}