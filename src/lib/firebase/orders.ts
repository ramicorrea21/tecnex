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
  type DocumentSnapshot
} from 'firebase/firestore'
import type { Order } from '@/types/order'
import { addOrderToCustomer } from './customers'
import type { CartItem } from '@/types/cart'

const COLLECTION = 'orders'

// Helper para convertir documento de Firestore a nuestro tipo
function convertOrder(doc: DocumentSnapshot): Order | null {
  if (!doc.exists()) return null
  
  const data = doc.data()
  return {
    id: doc.id,
    customerId: data?.customerId,
    items: data?.items || [],
    totalAmount: data?.totalAmount,
    paymentSuccessful: data?.paymentSuccessful || false,
    createdAt: data?.createdAt?.toDate(),
    updatedAt: data?.updatedAt?.toDate()
  }
}

// Crear nueva orden
export async function createOrder(
  customerId: string, 
  items: CartItem[], 
  totalAmount: number
): Promise<string> {
  try {
    // Crear la orden
    const orderRef = doc(collection(db, COLLECTION))
    const orderId = orderRef.id

    await setDoc(orderRef, {
      customerId,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase
      })),
      totalAmount,
      paymentSuccessful: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Vincular la orden al cliente
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

// Actualizar estado del pago de una orden
export async function updateOrderPayment(orderId: string, successful: boolean): Promise<void> {
  try {
    const orderRef = doc(db, COLLECTION, orderId)
    await updateDoc(orderRef, {
      paymentSuccessful: successful,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating order payment:', error)
    throw error
  }
}