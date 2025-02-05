export enum OrderStatus {
    REGISTERED = 'REGISTERED',
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
    DISPATCHED = 'DISPATCHED',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
  }
  
export interface Order {
  id: string
  customerId: string
  items: {
    productId: string
    quantity: number
    priceAtPurchase: number
  }[]
  totalAmount: number
  status: OrderStatus
  paymentId?: string
  paymentStatus: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
  statusHistory: {
    status: OrderStatus
    timestamp: Date
    note?: string
  }[]
}

export type OrderStatusUpdate = {
  status: OrderStatus
  note?: string
}