'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useProducts } from '@/hooks/use-products'
import type { Product } from '@/types/product'

export function Offers() {
  const { allProducts, loading } = useProducts()
  const [offerProducts, setOfferProducts] = useState<Product[]>([])
  const categorySlug = "celulares-" // Slug fijo según la información proporcionada
  const categoryId = "K4sqo6qgiA44UEpr7VFv" // ID fijo de la categoría
  
  useEffect(() => {
    // Obtener productos de la categoría celulares con descuento
    if (allProducts.length > 0) {
      const phoneOffers = allProducts.filter(product => 
        product.categoryId === categoryId && 
        product.comparePrice && 
        product.comparePrice > product.price
      ).slice(0, 5) // Limitamos a 5 productos para mostrar
      
      setOfferProducts(phoneOffers)
    }
  }, [allProducts])

  return (
    <section className="w-full py-4 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-200">
          <h2 className="text-sm font-normal text-gray-700">
            Ofertas únicas en <span className="font-bold">Smartphones</span>
          </h2>
          <Link href={`/${categorySlug}`} className="text-xs text-gray-500 hover:underline">
            Ver todo &gt;
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : offerProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {offerProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Link href={`/${categorySlug}/${product.slug}`} className="block">
                  <div className="relative">
                    {/* Etiqueta de descuento */}
                    {product.comparePrice && product.comparePrice > product.price && (
                      <div className="absolute top-0 right-0 bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded-bl-lg z-10">
                        {Math.round((1 - (product.price / product.comparePrice)) * 100)}%<br/>OFF
                      </div>
                    )}
                    
                    {/* Imagen del producto - ocupando todo el espacio */}
                    <div className="aspect-square w-full bg-gray-100 relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image 
                          src={product.images[0]} 
                          alt={product.name} 
                          fill
                          className="object-cover w-full h-full"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Sin imagen</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-2">
                    {/* Nombre del producto - más pequeño como en la imagen */}
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[2rem]">
                      {product.brand} {product.name}
                    </h3>
                    
                    <div className="mt-1">
                      {/* Precio actual */}
                      <p className="text-base font-bold text-gray-900">${product.price.toLocaleString()}</p>
                      
                      {/* Precio anterior */}
                      {product.comparePrice && product.comparePrice > product.price && (
                        <p className="text-xs text-gray-500 line-through">
                          ${product.comparePrice.toLocaleString()}
                        </p>
                      )}
                      
                      {/* Ahorro */}
                      {product.comparePrice && product.comparePrice > product.price && (
                        <p className="text-xs text-green-600 font-medium">
                          Ahorra - ${(product.comparePrice - product.price).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No hay ofertas de smartphones disponibles en este momento.</p>
          </div>
        )}
      </div>
    </section>
  )
}