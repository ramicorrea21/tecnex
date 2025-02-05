import { db } from '@/config/firebase'
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  type DocumentSnapshot
} from 'firebase/firestore'
import { OrderStatus } from '@/types/order'
import type { Order, OrderStatusUpdate } from '@/types/order'
import { addOrderToCustomer } from './customers'
import type { CartItem } from '@/types/cart'

const COLLECTION = 'orders'

function convertOrder(doc: DocumentSnapshot): Order | null {
  if (!doc.exists()) return null
  
  const data = doc.data()
  return {
    id: doc.id,
    customerId: data?.customerId,
    items: data?.items || [],
    totalAmount: data?.totalAmount,
    status: data?.status,
    paymentId: data?.paymentId,
    paymentStatus: data?.paymentStatus,
    statusHistory: data?.statusHistory?.map((h: any) => ({
      ...h,
      timestamp: h.timestamp?.toDate()
    })) || [],
    createdAt: data?.createdAt?.toDate(),
    updatedAt: data?.updatedAt?.toDate()
  }
}

// Crear nueva orden
// Crear nueva orden
export async function createOrder(
    customerId: string, 
    items: CartItem[], 
    totalAmount: number
  ): Promise<string> {
    try {
      const orderRef = doc(collection(db, COLLECTION))
      const orderId = orderRef.id
      
      const initialStatus = OrderStatus.REGISTERED
      const now = new Date()
  
      await setDoc(orderRef, {
        customerId,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase
        })),
        totalAmount,
        status: initialStatus,
        paymentStatus: 'pending',
        statusHistory: [{
          status: initialStatus,
          timestamp: now,
          note: 'Orden registrada'
        }],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
  
      await addOrderToCustomer(customerId, orderId)
  
      return orderId
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }
// Obtener orden por ID
export async function getOrder(id: string): Promise<Order | null> {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)
    return convertOrder(docSnap)
  } catch (error) {
    console.error('Error getting order:', error)
    throw error
  }
}

// Obtener órdenes de un cliente
export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, COLLECTION), 
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs
      .map(doc => convertOrder(doc))
      .filter((order): order is Order => order !== null)
  } catch (error) {
    console.error('Error getting customer orders:', error)
    throw error
  }
}

// Actualizar estado de una orden
export async function updateOrderStatus(
    orderId: string, 
    update: OrderStatusUpdate
  ): Promise<void> {
    try {
      const orderRef = doc(db, COLLECTION, orderId)
      const now = new Date()
  
      await updateDoc(orderRef, {
        status: update.status,
        statusHistory: arrayUnion({
          status: update.status,
          timestamp: now,
          note: update.note
        }),
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  }

export async function updateOrderPayment(
    orderId: string, 
    paymentId: string,
    status: 'approved' | 'rejected' | 'pending'
  ): Promise<void> {
    try {
      const orderRef = doc(db, COLLECTION, orderId)
      const now = new Date()
  
      const updates: any = {
        paymentId,
        paymentStatus: status,
        updatedAt: serverTimestamp()
      }
  
      // Si el pago es aprobado, actualizar también el estado de la orden
      if (status === 'approved') {
        updates.status = OrderStatus.PAYMENT_CONFIRMED
        updates.statusHistory = arrayUnion({
          status: OrderStatus.PAYMENT_CONFIRMED,
          timestamp: now,
          note: `Pago confirmado (ID: ${paymentId})`
        })
      } else if (status === 'pending') {
        updates.status = OrderStatus.PENDING_PAYMENT
        updates.statusHistory = arrayUnion({
          status: OrderStatus.PENDING_PAYMENT,
          timestamp: now,
          note: `Pago pendiente (ID: ${paymentId})`
        })
      } else {
        // Si el pago es rechazado
        updates.status = OrderStatus.REGISTERED
        updates.statusHistory = arrayUnion({
          status: OrderStatus.REGISTERED,
          timestamp: now,
          note: `Pago rechazado (ID: ${paymentId})`
        })
      }
  
      await updateDoc(orderRef, updates)
    } catch (error) {
      console.error('Error updating order payment:', error)
      throw error
    }
  }