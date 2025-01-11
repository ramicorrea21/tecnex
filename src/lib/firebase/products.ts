import { db, storage } from '@/config/firebase'
import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type QueryDocumentSnapshot
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import type { Product, ProductFormData, ProductFilters } from '@/types/product'

const COLLECTION = 'products'

// Helper para convertir documento de Firestore a nuestro tipo
function convertProduct(doc: QueryDocumentSnapshot): Product {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    price: data.price,
    comparePrice: data.comparePrice,
    stock: data.stock,
    images: data.images || [],
    categoryId: data.categoryId,
    active: data.active,
    featured: data.featured,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate()
  }
}

// Subir imagen a Storage
async function uploadProductImage(file: File, productId: string): Promise<string> {
  try {
    console.log('Uploading image:', file.name)
    const fileRef = ref(storage, `products/${productId}/${file.name}`)
    await uploadBytes(fileRef, file)
    const url = await getDownloadURL(fileRef)
    console.log('Image uploaded, URL:', url)
    return url
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Eliminar imagen de Storage
async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, imageUrl)
    await deleteObject(fileRef)
    console.log('Image deleted:', imageUrl)
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

// Obtener productos con filtros opcionales
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    console.log('Getting products with filters:', filters)
    let q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
    
    if (filters?.category) {
      q = query(q, where('categoryId', '==', filters.category))
    }
    
    if (filters?.inStock) {
      q = query(q, where('stock', '>', 0))
    }
    
    if (filters?.active !== undefined) {
      q = query(q, where('active', '==', filters.active))
    }
    
    const snapshot = await getDocs(q)
    const products = snapshot.docs.map(convertProduct)
    console.log('Retrieved products:', products)
    return products
  } catch (error) {
    console.error('Error getting products:', error)
    throw error
  }
}

// Obtener un producto por ID
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return convertProduct(docSnap)
  } catch (error) {
    console.error('Error getting product:', error)
    throw error
  }
}

// Crear producto
export async function createProduct(data: ProductFormData): Promise<string> {
  try {
    console.log('Creating product:', data)
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    // Primero crear el documento para tener el ID
    const docRef = await addDoc(collection(db, COLLECTION), {
      name: data.name,
      slug,
      description: data.description,
      price: Number(data.price),
      comparePrice: data.comparePrice ? Number(data.comparePrice) : null,
      stock: Number(data.stock),
      categoryId: data.categoryId,
      active: data.active,
      featured: data.featured,
      images: [], // Las URLs se añadirán después
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Si hay imágenes, subirlas y actualizar el documento
    if (data.images && data.images.length > 0) {
      console.log('Uploading images...')
      const imageUrls = await Promise.all(
        data.images.map(file => uploadProductImage(file, docRef.id))
      )
      
      console.log('Image URLs:', imageUrls)
      await updateDoc(docRef, {
        images: imageUrls
      })
    }

    return docRef.id
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

// Actualizar producto
export async function updateProduct(id: string, data: ProductFormData): Promise<void> {
  try {
    console.log('Updating product:', id, data)
    const docRef = doc(db, COLLECTION, id)
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    // Manejar imágenes existentes y nuevas
    let imageUrls = data.existingImages || []
    
    if (data.images && data.images.length > 0) {
      const newImageUrls = await Promise.all(
        data.images.map(file => uploadProductImage(file, id))
      )
      imageUrls = [...imageUrls, ...newImageUrls]
    }
    
    await updateDoc(docRef, {
      name: data.name,
      slug,
      description: data.description,
      price: Number(data.price),
      comparePrice: data.comparePrice ? Number(data.comparePrice) : null,
      stock: Number(data.stock),
      categoryId: data.categoryId,
      active: data.active,
      featured: data.featured,
      images: imageUrls,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

// Eliminar producto
export async function deleteProduct(id: string, imageUrls: string[]): Promise<void> {
  try {
    console.log('Deleting product:', id)
    // Primero eliminar las imágenes
    if (imageUrls && imageUrls.length > 0) {
      await Promise.all(
        imageUrls.map(url => deleteProductImage(url))
      )
    }
    
    // Luego eliminar el documento
    const docRef = doc(db, COLLECTION, id)
    await deleteDoc(docRef)
    console.log('Product deleted successfully')
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}