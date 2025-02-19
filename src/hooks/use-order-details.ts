// src/hooks/useOrderDetails.ts
import { useState, useEffect } from 'react'
import { getOrder } from '@/lib/firebase/orders'
import { getCustomer } from '@/lib/firebase/customers'
import type { Order } from '@/types/order'
import type { Customer } from '@/types/customer'

interface OrderDetails {
  order: Order | null
  customer: Customer | null
  isLoading: boolean
  error: Error | null
}

export function useOrderDetails(orderId: string | null) {
  const [details, setDetails] = useState<OrderDetails>({
    order: null,
    customer: null,
    isLoading: false,
    error: null
  })

  useEffect(() => {
    // Si no hay orderId, no hacer nada
    if (!orderId) return
    
    let isMounted = true
    
    async function fetchDetails() {
      try {
        if (isMounted) setDetails(prev => ({ ...prev, isLoading: true, error: null }))
        
        // Usamos type assertion para asegurar a TypeScript que orderId no es null
        // Ya verificamos esto con el if (!orderId) return
        const orderData = await getOrder(orderId as string) // Línea 35
        if (!orderData) throw new Error('Orden no encontrada')
        
        // Obtener cliente
        const customerData = await getCustomer(orderData.customerId)
        if (!customerData) throw new Error('Cliente no encontrado')
        
        if (isMounted) {
          setDetails({
            order: orderData,
            customer: customerData,
            isLoading: false,
            error: null
          })
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching order details:', err)
          setDetails(prev => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err : new Error('Error desconocido')
          }))
        }
      }
    }
    
    fetchDetails()
    
    return () => {
      isMounted = false
    }
  }, [orderId])

  return details
}