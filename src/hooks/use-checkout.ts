import { useState } from 'react'
import { useCart } from '@/contexts/cart-context'
import { saveCustomer } from '@/lib/firebase/customers'
import { createOrder, updateOrderPayment } from '@/lib/firebase/orders'
import { createPaymentPreference } from '@/lib/mercadopago'
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
  const [preferenceId, setPreferenceId] = useState<string | null>(null)

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

  // Procesar los datos del cliente y crear orden
  const processCustomerInfo = async (data: CustomerFormData) => {
    try {
      setIsProcessing(true)
      setError(null)

      // Validar datos del cliente
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

        // Crear preferencia de MP
        const customer = {
          ...data,
          id: savedCustomerId,
          orderIds: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        const preference = await createPaymentPreference(
          newOrderId,
          cart.items,
          customer
        )
        setPreferenceId(preference.id)
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

  // Manejar el resultado del pago
  const handlePaymentResult = async (
    paymentId: string, 
    status: 'approved' | 'rejected' | 'pending'
  ) => {
    try {
      setIsProcessing(true)
      setError(null)

      if (!orderId) {
        throw new Error('No hay orden activa')
      }

      // Actualizar estado del pago en la orden
      await updateOrderPayment(orderId, paymentId, status)

      if (status === 'approved') {
        clearCart()
        setCurrentStep('confirmation')
      } else if (status === 'pending') {
        // Manejar pago pendiente
        setError({
          step: 'payment',
          message: 'El pago está pendiente de confirmación'
        })
      } else {
        // Manejar pago rechazado
        setError({
          step: 'payment',
          message: 'El pago fue rechazado. Por favor, intenta con otro método.'
        })
      }
    } catch (err) {
      setError({
        step: 'payment',
        message: 'Error al procesar el resultado del pago'
      })
      console.error('Error handling payment result:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Reiniciar el proceso
  const resetCheckout = () => {
    setCurrentStep('customer-info')
    setError(null)
    setOrderId(null)
    setCustomerId(null)
    setPreferenceId(null)
    setIsProcessing(false)
  }

  return {
    currentStep,
    isProcessing,
    error,
    orderId,
    customerId,
    preferenceId,
    processCustomerInfo,
    handlePaymentResult,
    resetCheckout
  }
}