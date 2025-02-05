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
  serverTimestamp,
  type DocumentSnapshot
} from 'firebase/firestore'
import type { Customer } from '@/types/customer'

const COLLECTION = 'customers'

// Helper para convertir documento de Firestore a nuestro tipo
function convertCustomer(doc: DocumentSnapshot): Customer | null {
  if (!doc.exists()) return null
  
  const data = doc.data()
  return {
    id: doc.id,
    firstName: data?.firstName,
    lastName: data?.lastName,
    dni: data?.dni,
    email: data?.email,
    phone: data?.string,
    street: data?.street,
    streetNumber: data?.streetNumber,
    zipCode: data?.zipCode,
    orderIds: data?.orderIds || [],
    createdAt: data?.createdAt?.toDate(),
    updatedAt: data?.updatedAt?.toDate()
  }
}

// Crear o actualizar cliente
export async function saveCustomer(data: Omit<Customer, 'id' | 'orderIds' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    // Buscar si existe un cliente con el mismo email
    const q = query(collection(db, COLLECTION), where('email', '==', data.email))
    const snapshot = await getDocs(q)
    
    let customerId: string

    if (!snapshot.empty) {
      // Actualizar cliente existente
      customerId = snapshot.docs[0].id
      await updateDoc(doc(db, COLLECTION, customerId), {
        ...data,
        updatedAt: serverTimestamp()
      })
    } else {
      // Crear nuevo cliente
      const customerRef = doc(collection(db, COLLECTION))
      customerId = customerRef.id
      await setDoc(customerRef, {
        ...data,
        orderIds: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }

    return customerId
  } catch (error) {
    console.error('Error saving customer:', error)
    throw error
  }
}

// Obtener cliente por ID
export async function getCustomer(id: string): Promise<Customer | null> {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)
    return convertCustomer(docSnap)
  } catch (error) {
    console.error('Error getting customer:', error)
    throw error
  }
}

// Obtener cliente por email
export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  try {
    const q = query(collection(db, COLLECTION), where('email', '==', email))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    return convertCustomer(snapshot.docs[0])
  } catch (error) {
    console.error('Error getting customer by email:', error)
    throw error
  }
}

// Agregar orden al cliente
export async function addOrderToCustomer(customerId: string, orderId: string): Promise<void> {
  try {
    const customerRef = doc(db, COLLECTION, customerId)
    const customerSnap = await getDoc(customerRef)
    
    if (!customerSnap.exists()) {
      throw new Error('Customer not found')
    }
    
    const currentOrders = customerSnap.data().orderIds || []
    await updateDoc(customerRef, {
      orderIds: [...currentOrders, orderId],
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error adding order to customer:', error)
    throw error
  }
}