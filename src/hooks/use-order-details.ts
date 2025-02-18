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
    if (!orderId) return

    const fetchDetails = async () => {
      try {
        setDetails(prev => ({ ...prev, isLoading: true, error: null }))
        
        const orderData = await getOrder(orderId)
        if (!orderData) throw new Error('Orden no encontrada')
        
        const customerData = await getCustomer(orderData.customerId)
        if (!customerData) throw new Error('Cliente no encontrado')

        setDetails({
          order: orderData,
          customer: customerData,
          isLoading: false,
          error: null
        })
      } catch (err) {
        setDetails(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err : new Error('Error al cargar detalles')
        }))
      }
    }

    fetchDetails()
  }, [orderId])

  return details
}