'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Limpiar el carrito y estados al montar
  useEffect(() => {
    // Aquí podríamos limpiar el carrito si no se hizo antes
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-green-100 p-2">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <CardTitle>¡Pago exitoso!</CardTitle>
              <CardDescription>
                Tu orden ha sido confirmada
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Número de orden: {searchParams.get('external_reference')}
          </p>
          <p className="text-sm text-muted-foreground">
            Te enviaremos un email con los detalles de tu compra y el seguimiento de tu pedido.
          </p>
          <Button 
            className="w-full" 
            onClick={() => router.push('/')}
          >
            Volver a la tienda
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}