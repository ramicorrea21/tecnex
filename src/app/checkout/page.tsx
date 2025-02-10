'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, AlertCircle } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useCheckout } from "@/hooks/use-checkout"
import { formatPrice } from "@/lib/cart-utils"
import { MainNav } from "@/components/store/MainNav"
import { CategoryNav } from "@/components/store/CategoryNav"
import { MercadoPagoButton } from "@/components/checkout/MercadoPagoButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card"
import type { CustomerFormData } from "@/types/customer"

interface FormErrors {
  [key: string]: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { 
    cart, 
    status, 
    totalItems, 
    totalAmount 
  } = useCart()
  const {
    currentStep,
    isProcessing,
    error,
    orderId,
    preferenceId,
    processCustomerInfo,
    handlePaymentResult,
    resetCheckout
  } = useCheckout()
 

  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phone: '',
    street: '',
    streetNumber: '',
    zipCode: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})

  if (!cart || status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <CategoryNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error al modificar el campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center gap-4">
      <span className={`text-sm font-medium ${currentStep === 'customer-info' ? 'text-primary' : 'text-muted-foreground'}`}>
        1. Datos personales
      </span>
      <span className="text-muted-foreground">→</span>
      <span className={`text-sm font-medium ${currentStep === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
        2. Pago
      </span>
      <span className="text-muted-foreground">→</span>
      <span className={`text-sm font-medium ${currentStep === 'confirmation' ? 'text-primary' : 'text-muted-foreground'}`}>
        3. Confirmación
      </span>
    </div>
  )

  const renderCustomerForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
        <CardDescription>
          Ingresa tus datos para completar la compra
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && error.step === 'customer-info' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Primera fila - Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Segunda fila - DNI, Email y Teléfono */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              className={errors.dni ? "border-red-500" : ""}
            />
            {errors.dni && (
              <p className="text-sm text-red-500">{errors.dni}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono (WhatsApp)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="11 1234-5678"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Tercera fila - Dirección */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="street">Calle</Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className={errors.street ? "border-red-500" : ""}
            />
            {errors.street && (
              <p className="text-sm text-red-500">{errors.street}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="streetNumber">Número</Label>
            <Input
              id="streetNumber"
              name="streetNumber"
              value={formData.streetNumber}
              onChange={handleInputChange}
              className={errors.streetNumber ? "border-red-500" : ""}
            />
            {errors.streetNumber && (
              <p className="text-sm text-red-500">{errors.streetNumber}</p>
            )}
          </div>
        </div>

        {/* Cuarta fila - Código Postal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zipCode">Código Postal</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className={errors.zipCode ? "border-red-500" : ""}
            />
            {errors.zipCode && (
              <p className="text-sm text-red-500">{errors.zipCode}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => processCustomerInfo(formData)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            'Siguiente'
          )}
        </Button>
      </CardFooter>
    </Card>
  )


  const renderPaymentForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Método de Pago</CardTitle>
        <CardDescription>
          Elige cómo quieres pagar tu compra
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && error.step === 'payment' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>
        )}
        
        {preferenceId && (
          <MercadoPagoButton 
            preferenceId={preferenceId}
            onSuccess={() => {
              const urlParams = new URLSearchParams(window.location.search)
              const paymentId = urlParams.get('payment_id')
              if (paymentId) {
                handlePaymentResult(paymentId, 'approved')
              }
            }}
            onFailure={() => {
              const urlParams = new URLSearchParams(window.location.search)
              const paymentId = urlParams.get('payment_id')
              if (paymentId) {
                handlePaymentResult(paymentId, 'rejected')
              }
            }}
            onPending={() => {
              const urlParams = new URLSearchParams(window.location.search)
              const paymentId = urlParams.get('payment_id')
              if (paymentId) {
                handlePaymentResult(paymentId, 'pending')
              }
            }}
          />
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={resetCheckout}
          disabled={isProcessing}
        >
          Volver
        </Button>
      </CardFooter>
    </Card>
  )

  const renderConfirmation = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-6 w-6 text-green-500" />
          ¡Compra realizada con éxito!
        </CardTitle>
        <CardDescription>
          Tu pedido ha sido confirmado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Número de orden: {orderId}</p>
        <p>Te enviaremos un email con los detalles de tu compra.</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          className="w-full" 
          onClick={() => router.push('/')}
        >
          Volver a la tienda
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <CategoryNav />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Checkout</h1>
              {renderStepIndicator()}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Forms */}
              <div className="lg:col-span-2">
                {currentStep === 'customer-info' && renderCustomerForm()}
                {currentStep === 'payment' && renderPaymentForm()}
                {currentStep === 'confirmation' && renderConfirmation()}
              </div>

              {/* Resumen */}
              {currentStep !== 'confirmation' && (
                <div className="lg:sticky lg:top-8 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumen de compra</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Lista de productos */}
                      <ScrollArea className="h-[250px]">
                        {cart.items.map((item) => (
                          <div key={item.productId} className="flex gap-4 mb-4">
                            <div className="h-16 w-16 rounded-md border overflow-hidden">
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Cantidad: {item.quantity}
                              </p>
                              <p className="font-medium">
                                {formatPrice(item.priceAtPurchase * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Subtotal ({totalItems} productos)</span>
                          <span>{formatPrice(totalAmount)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Envío</span>
                          <span className="text-green-600">Gratis</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between text-lg font-medium">
                        <span>Total</span>
                        <span>{formatPrice(totalAmount)}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        asChild
                      >
                        <Link href="/cart">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Volver al carrito
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}