// src/hooks/useOrders.ts
import { useState, useEffect, useCallback } from 'react'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  getDocs,
  type Query,
  type QueryDocumentSnapshot
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Order } from '@/types/order'
import type { OrderFilters, OrdersQueryResult } from '@/types/orders-filters'

const ORDERS_PER_PAGE = 10
const COLLECTION = 'orders'

export function useOrders(initialFilters: OrderFilters = {}): OrdersQueryResult {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false) // Cambiado a false inicialmente
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null)
  const [filters, setFilters] = useState<OrderFilters>(initialFilters)

  const buildQuery = useCallback(() => {
    let baseQuery: Query = query(
      collection(db, COLLECTION),
      orderBy('createdAt', 'desc')
    )
  
    if (filters.status) {
      baseQuery = query(baseQuery, where('status', '==', filters.status))
    }
  
    if (filters.paymentStatus) {
      baseQuery = query(baseQuery, where('paymentStatus', '==', filters.paymentStatus))
    }

    if (filters.dateFrom) {
      baseQuery = query(baseQuery, where('createdAt', '>=', filters.dateFrom))
    }

    if (filters.dateTo) {
      baseQuery = query(baseQuery, where('createdAt', '<=', filters.dateTo))
    }

    baseQuery = query(baseQuery, limit(ORDERS_PER_PAGE))

    if (lastDoc) {
      baseQuery = query(baseQuery, startAfter(lastDoc))
    }

    return baseQuery
  }, [filters, lastDoc])

  const convertOrder = useCallback((doc: QueryDocumentSnapshot): Order => {
    const data = doc.data()
    return {
      id: doc.id,
      customerId: data.customerId,
      items: data.items,
      totalAmount: data.totalAmount,
      status: data.status,
      paymentId: data.paymentId,
      paymentStatus: data.paymentStatus,
      statusHistory: data.statusHistory.map((h: any) => ({
        ...h,
        timestamp: h.timestamp.toDate()
      })),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    }
  }, [])

  const loadOrders = useCallback(async (isLoadingMore = false) => {
    try {
      setIsLoading(true)
      setError(null)

      const q = buildQuery()
      const snapshot = await getDocs(q)

      const newOrders = snapshot.docs.map(convertOrder)

      setOrders(prev => isLoadingMore ? [...prev, ...newOrders] : newOrders)
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null)
      setHasMore(snapshot.docs.length === ORDERS_PER_PAGE)
    } catch (err) {
      console.error('Error loading orders:', err)
      setError(err instanceof Error ? err : new Error('Error loading orders'))
    } finally {
      setIsLoading(false)
    }
  }, [buildQuery, convertOrder])

  useEffect(() => {
    loadOrders()
    // Solo se ejecuta cuando cambian los filtros
  }, [filters])

  return {
    orders,
    isLoading,
    error,
    hasMore,
    loadMore: () => loadOrders(true),
    filters,
    setFilters: useCallback((newFilters: OrderFilters) => {
      setLastDoc(null)
      setFilters(newFilters)
    }, []),
    refresh: () => loadOrders()
  }
}