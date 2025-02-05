'use client'

import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CheckoutFailurePage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-red-100 p-2">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <CardTitle>Error en el pago</CardTitle>
              <CardDescription>
                No pudimos procesar tu pago
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Por favor, intenta nuevamente con otro método de pago o contacta a tu banco.
          </p>
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={() => router.push('/checkout')}
            >
              Intentar nuevamente
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
            >
              Volver a la tienda
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}