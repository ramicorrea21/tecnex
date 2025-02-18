// src/types/filters.ts
import { OrderStatus, type Order } from '@/types/order'

export interface OrderFilters {
  status?: OrderStatus
  paymentStatus?: 'pending' | 'approved' | 'rejected'
  dateFrom?: Date
  dateTo?: Date
  search?: string
}

export interface OrdersQueryResult {
  orders: Order[]
  isLoading: boolean
  error: Error | null
  hasMore: boolean
  loadMore: () => Promise<void>
  filters: OrderFilters
  setFilters: (filters: OrderFilters) => void
  refresh: () => Promise<void>
}