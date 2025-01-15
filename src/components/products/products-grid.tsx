'use client'

import Image from 'next/image'
import { Edit, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types/product'

const PLACEHOLDER_IMAGE = '/no-image.png'

interface ProductsGridProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

function ProductImage({ src }: { src: string }) {
  return (
    <div className="relative aspect-square">
      <Image
        src={src}
        alt="Product image"
        fill
        className="object-cover rounded-md"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = PLACEHOLDER_IMAGE;
        }}
        unoptimized
      />
    </div>
  )
}

export function ProductsGrid({ products, onEdit, onDelete }: ProductsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <ProductImage src={product.images[0] || PLACEHOLDER_IMAGE} />
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant={product.active ? "default" : "secondary"}>
                {product.active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Stock: {product.stock}</span>
              {product.featured && (
                <Badge variant="secondary">Destacado</Badge>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(product)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600"
                onClick={() => onDelete(product)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}