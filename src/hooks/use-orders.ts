// src/hooks/useOrders.ts
import { useState, useEffect } from 'react'
import { 
  collection, 
  query, 
  orderBy, 
  getDocs,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Order } from '@/types/order'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      
      const loadedOrders = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          customerId: data.customerId,
          items: data.items || [],
          totalAmount: data.totalAmount,
          status: data.status,
          paymentId: data.paymentId,
          paymentStatus: data.paymentStatus,
          statusHistory: data.statusHistory?.map((h: any) => ({
            ...h,
            timestamp: h.timestamp?.toDate()
          })) || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        }
      })

      setOrders(loadedOrders)
    } catch (err) {
      console.error('Error loading orders:', err)
      setError(err instanceof Error ? err : new Error('Error loading orders'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return {
    orders,
    isLoading,
    error,
    refresh: loadOrders
  }
}