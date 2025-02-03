import { db } from '@/config/firebase'
import { 
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type DocumentSnapshot
} from 'firebase/firestore'
import type { Cart, CartItem } from '@/types/cart'

const COLLECTION = 'carts'

// Helper para convertir documento de Firestore a nuestro tipo Cart
function convertCart(doc: DocumentSnapshot): Cart | null {
  if (!doc.exists()) return null
  
  const data = doc.data()
  return {
    id: doc.id,
    items: data?.items || [],
    lastModified: data?.lastModified?.toDate() || new Date(),
  }
}

// Crear o actualizar un carrito
export async function saveCart(cartId: string, data: Omit<Cart, 'id'>): Promise<void> {
  try {
    console.log('Saving cart:', cartId, data)
    await setDoc(doc(db, COLLECTION, cartId), {
      items: data.items,
      lastModified: serverTimestamp(),
      status: 'active'
    })
  } catch (error) {
    console.error('Error saving cart:', error)
    throw error
  }
}

// Obtener un carrito por ID
export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const docRef = doc(db, COLLECTION, cartId)
    const docSnap = await getDoc(docRef)
    return convertCart(docSnap)
  } catch (error) {
    console.error('Error getting cart:', error)
    throw error
  }
}

// Marcar un carrito como expirado
export async function expireCart(cartId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, cartId)
    await updateDoc(docRef, {
      status: 'expired',
      lastModified: serverTimestamp()
    })
  } catch (error) {
    console.error('Error expiring cart:', error)
    throw error
  }
}

// Eliminar un carrito
export async function deleteCart(cartId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, cartId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting cart:', error)
    throw error
  }
}