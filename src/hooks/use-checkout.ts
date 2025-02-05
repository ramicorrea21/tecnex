import { useState } from 'react'
import { useCart } from '@/contexts/cart-context'
import { saveCustomer } from '@/lib/firebase/customers'
import { createOrder, updateOrderPayment } from '@/lib/firebase/orders'
import type { CustomerFormData } from '@/types/customer'

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
  const validateCustomerData = (data: CustomerFormData): boolean => {
    // Reglas de validación
    if (!data.firstName || !data.lastName || !data.dni || !data.email ||
        !data.street || !data.streetNumber || !data.zipCode) {
      return false
    }

    // Validar DNI
    if (!/^\d{7,8}$/.test(data.dni)) {
      return false
    }

    // Validar email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return false
    }

    // Validar código postal
    if (!/^\d{4}$/.test(data.zipCode)) {
      return false
    }

    return true
  }

  // Procesar los datos del cliente
  const processCustomerInfo = async (data: CustomerFormData) => {
    try {
      setIsProcessing(true)
      setError(null)

      if (!validateCustomerData(data)) {
        throw new Error('Datos del cliente inválidos')
      }

      const savedCustomerId = await saveCustomer({
        firstName: data.firstName,
        lastName: data.lastName,
        dni: data.dni,
        email: data.email,
        street: data.street,
        streetNumber: data.streetNumber,
        zipCode: data.zipCode
      })

      setCustomerId(savedCustomerId)
      setCurrentStep('payment')
    } catch (err) {
      setError({
        step: 'customer-info',
        message: 'Error al procesar los datos del cliente'
      })
      console.error('Error processing customer info:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Procesar el pago
  const processPayment = async () => {
    if (!customerId || !cart) {
      setError({
        step: 'payment',
        message: 'Error al procesar el pago: información faltante'
      })
      return
    }

    try {
      setIsProcessing(true)
      setError(null)

      // Crear la orden primero
      const newOrderId = await createOrder(
        customerId,
        cart.items,
        totalAmount
      )
      setOrderId(newOrderId)

      // Aquí iría la integración con Mercado Pago
      // Por ahora simulamos un pago exitoso
      const paymentResult = await simulatePayment()

      // Actualizar el estado del pago en la orden
      await updateOrderPayment(newOrderId, paymentResult.success)

      if (paymentResult.success) {
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
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
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