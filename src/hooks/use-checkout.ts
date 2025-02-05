import { useState } from 'react'
import { useCart } from '@/contexts/cart-context'
import { saveCustomer } from '@/lib/firebase/customers'
import { createOrder, updateOrderPayment } from '@/lib/firebase/orders'
import type { CustomerFormData } from '@/types/customer'
import { OrderStatus } from '@/types/order'

export type CheckoutStep = 'customer-info' | 'payment' | 'confirmation'

interface CheckoutError {
  step: CheckoutStep
  message: string
}

export function useCheckout() {
  const { cart, totalAmount, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('customer-info')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<CheckoutError | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [customerId, setCustomerId] = useState<string | null>(null)

  // Validar los datos del cliente
  const validateCustomerData = (data: CustomerFormData): { isValid: boolean; errors: { [key: string]: string } } => {
    const errors: { [key: string]: string } = {}

    if (!data.firstName) errors.firstName = 'El nombre es requerido'
    if (!data.lastName) errors.lastName = 'El apellido es requerido'
    
    if (!data.dni) {
      errors.dni = 'El DNI es requerido'
    } else if (!/^\d{7,8}$/.test(data.dni)) {
      errors.dni = 'DNI inválido'
    }

    if (!data.email) {
      errors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email inválido'
    }

    if (!data.phone) {
      errors.phone = 'El teléfono es requerido'
    } else if (!/^(\+)?[\d\s-]{10,}$/.test(data.phone)) {
      errors.phone = 'Teléfono inválido'
    }

    if (!data.street) errors.street = 'La calle es requerida'
    if (!data.streetNumber) errors.streetNumber = 'El número es requerido'
    
    if (!data.zipCode) {
      errors.zipCode = 'El código postal es requerido'
    } else if (!/^\d{4}$/.test(data.zipCode)) {
      errors.zipCode = 'Código postal inválido'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // Procesar los datos del cliente
  const processCustomerInfo = async (data: CustomerFormData) => {
    try {
      setIsProcessing(true)
      setError(null)

      const validation = validateCustomerData(data)
      if (!validation.isValid) {
        setError({
          step: 'customer-info',
          message: 'Por favor, revisa los campos marcados en rojo'
        })
        return validation.errors
      }

      // Guardar o actualizar cliente
      const savedCustomerId = await saveCustomer({
        firstName: data.firstName,
        lastName: data.lastName,
        dni: data.dni,
        email: data.email,
        phone: data.phone,
        street: data.street,
        streetNumber: data.streetNumber,
        zipCode: data.zipCode
      })

      // Crear orden inicial
      if (cart) {
        const newOrderId = await createOrder(
          savedCustomerId,
          cart.items,
          totalAmount
        )
        setOrderId(newOrderId)
      }

      setCustomerId(savedCustomerId)
      setCurrentStep('payment')
      return null
    } catch (err) {
      setError({
        step: 'customer-info',
        message: 'Error al procesar los datos del cliente'
      })
      console.error('Error processing customer info:', err)
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  // Procesar el pago
  const processPayment = async () => {
    if (!customerId || !cart || !orderId) {
      setError({
        step: 'payment',
        message: 'Error al procesar el pago: información faltante'
      })
      return
    }

    try {
      setIsProcessing(true)
      setError(null)

      // Aquí iría la integración con Mercado Pago
      const paymentResult = await simulatePayment()

      // Actualizar el estado del pago en la orden
      await updateOrderPayment(
        orderId,
        paymentResult.paymentId,
        paymentResult.status
      )

      if (paymentResult.status === 'approved') {
        clearCart()
        setCurrentStep('confirmation')
      } else {
        throw new Error('Pago rechazado')
      }
    } catch (err) {
      setError({
        step: 'payment',
        message: 'Error al procesar el pago'
      })
      console.error('Error processing payment:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Simulación temporal del pago
  const simulatePayment = async () => {
    return new Promise<{ status: 'approved' | 'rejected', paymentId: string }>((resolve) => {
      setTimeout(() => {
        resolve({ 
          status: 'approved',
          paymentId: `MP_${Date.now()}`
        })
      }, 2000)
    })
  }

  // Reiniciar el proceso
  const resetCheckout = () => {
    setCurrentStep('customer-info')
    setError(null)
    setOrderId(null)
    setCustomerId(null)
    setIsProcessing(false)
  }

  return {
    currentStep,
    isProcessing,
    error,
    orderId,
    processCustomerInfo,
    processPayment,
    resetCheckout
  }
}