import { db } from '@/config/firebase'
import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  type QueryDocumentSnapshot
} from 'firebase/firestore'
import type { Category, CategoryFormData } from '@/types/category'

const COLLECTION = 'categories'

// Helper para convertir el documento de Firestore a nuestro tipo
function convertCategory(doc: QueryDocumentSnapshot): Category {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    active: data.active,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate()
  }
}

// Obtener todas las categorías
export async function getCategories(): Promise<Category[]> {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(convertCategory)
}

// Obtener una categoría por ID
export async function getCategory(id: string): Promise<Category | null> {
  const docRef = doc(db, COLLECTION, id)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) return null
  return convertCategory(docSnap)
}

// Crear una categoría
export async function createCategory(data: CategoryFormData): Promise<string> {
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    slug,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return docRef.id
}

// Actualizar una categoría
export async function updateCategory(id: string, data: CategoryFormData): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  await updateDoc(docRef, {
    ...data,
    slug,
    updatedAt: serverTimestamp()
  })
}

// Eliminar una categoría
export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}