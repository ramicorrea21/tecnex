export interface Order {
    id: string
    customerId: string
    items: {
      productId: string
      quantity: number
      priceAtPurchase: number
    }[]
    totalAmount: number
    paymentSuccessful: boolean
    createdAt: Date
    updatedAt: Date
  }