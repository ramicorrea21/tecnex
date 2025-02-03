'use client'

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState,
  useCallback
} from 'react'
import { useToast } from '@/hooks/use-toast'
import { 
  saveCart,
  getCart,
  expireCart
} from '@/lib/firebase/cart'
import {
  generateCartId,
  getStoredCartId,
  saveCartId,
  clearStoredCart,
  hasCartExpired,
  calculateTotalItems,
  calculateTotalAmount,
  canAddMoreItems,
  createCartItem,
  MAX_QUANTITY_PER_ITEM,
  CART_EXPIRATION_HOURS
} from '@/lib/cart-utils'
import type { Cart, CartContextType, CartItem } from '@/types/cart'
import type { Product } from '@/types/product'

// Crear el contexto
const CartContext = createContext<CartContextType | null>(null)

// Provider Component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [status, setStatus] = useState<CartContextType['status']>('loading')
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Inicializar o cargar carrito existente
  const initCart = useCallback(async () => {
    try {
      let cartId = getStoredCartId()
      
      if (cartId) {
        // Intentar cargar carrito existente
        const existingCart = await getCart(cartId)
        
        if (existingCart && !hasCartExpired(existingCart.lastModified)) {
          setCart(existingCart)
          setStatus('idle')
          return
        } else if (existingCart) {
          // Si existe pero expiró, marcarlo como expirado
          await expireCart(cartId)
          clearStoredCart()
        }
      }
      
      // Crear nuevo carrito si no existe o expiró
      cartId = generateCartId()
      const newCart: Cart = {
        id: cartId,
        items: [],
        lastModified: new Date()
      }
      
      await saveCart(cartId, newCart)
      saveCartId(cartId)
      setCart(newCart)
      setStatus('idle')
      
    } catch (err) {
      console.error('Error initializing cart:', err)
      setError('Error al inicializar el carrito')
      setStatus('error')
    }
  }, [])

  // Cargar carrito al montar el componente
  useEffect(() => {
    initCart()
  }, [initCart])

  // Agregar item al carrito
  const addItem = async (product: Product, quantity: number) => {
    if (!cart) return
    
    try {
      setStatus('loading')
      const existingItem = cart.items.find(item => item.productId === product.id)
      let newItems: CartItem[]

      if (existingItem) {
        // Verificar si podemos agregar más
        if (!canAddMoreItems(existingItem.quantity, quantity)) {
          toast({
            title: "Límite alcanzado",
            description: `No puedes agregar más de ${MAX_QUANTITY_PER_ITEM} unidades del mismo producto`,
            variant: "destructive"
          })
          return
        }

        newItems = cart.items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        newItems = [...cart.items, createCartItem(product, quantity)]
      }

      const updatedCart: Cart = {
        ...cart,
        items: newItems,
        lastModified: new Date()
      }

      await saveCart(cart.id, updatedCart)
      setCart(updatedCart)
      
      toast({
        title: "Producto agregado",
        description: `${product.name} se agregó al carrito`
      })
    } catch (err) {
      console.error('Error adding item to cart:', err)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive"
      })
    } finally {
      setStatus('idle')
    }
  }

  // Remover item del carrito
  const removeItem = async (productId: string) => {
    if (!cart) return

    try {
      setStatus('loading')
      const updatedCart: Cart = {
        ...cart,
        items: cart.items.filter(item => item.productId !== productId),
        lastModified: new Date()
      }

      await saveCart(cart.id, updatedCart)
      setCart(updatedCart)
      
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó del carrito"
      })
    } catch (err) {
      console.error('Error removing item from cart:', err)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto del carrito",
        variant: "destructive"
      })
    } finally {
      setStatus('idle')
    }
  }

  // Actualizar cantidad de un item
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!cart) return
    
    try {
      if (quantity > MAX_QUANTITY_PER_ITEM) {
        toast({
          title: "Límite excedido",
          description: `No puedes agregar más de ${MAX_QUANTITY_PER_ITEM} unidades`,
          variant: "destructive"
        })
        return
      }

      // Actualizar estado local primero
      setCart({
        ...cart,
        items: cart.items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        ),
        lastModified: new Date()
      })

      // Luego sincronizar con Firebase
      await saveCart(cart.id, {
        ...cart,
        items: cart.items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        ),
        lastModified: new Date()
      })
    } catch (err) {
      console.error('Error updating quantity:', err)
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad",
        variant: "destructive"
      })
    }
  }
  // Limpiar carrito
  const clearCart = async () => {
    if (!cart) return

    try {
      setStatus('loading')
      const newCart: Cart = {
        ...cart,
        items: [],
        lastModified: new Date()
      }

      await saveCart(cart.id, newCart)
      setCart(newCart)
      
      toast({
        title: "Carrito vacío",
        description: "Se eliminaron todos los productos del carrito"
      })
    } catch (err) {
      console.error('Error clearing cart:', err)
      toast({
        title: "Error",
        description: "No se pudo vaciar el carrito",
        variant: "destructive"
      })
    } finally {
      setStatus('idle')
    }
  }

  // Calcular totales
  const totalItems = cart ? calculateTotalItems(cart.items) : 0
  const totalAmount = cart ? calculateTotalAmount(cart.items) : 0

  // Valor del contexto
  const value: CartContextType = {
    cart,
    status,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
    MAX_QUANTITY_PER_ITEM,
    CART_EXPIRATION_HOURS
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return context
}