import { type CartItem } from '@/types/cart'
import { type Customer } from '@/types/customer'
import type { 
  MercadoPagoPreference,
  MercadoPagoPreferenceResponse,
  PaymentStatus 
} from '@/types/mercadopago'
import { MERCADOPAGO_CONFIG } from '@/config/mercadopago'

// Convertir items del carrito al formato de MP
function convertCartItemsToMPFormat(items: CartItem[]) {
  return items.map(item => ({
    id: item.productId,
    title: item.product.name,
    description: item.product.description,
    picture_url: item.product.images[0],
    quantity: item.quantity,
    currency_id: 'ARS',
    unit_price: item.priceAtPurchase
  }))
}

// Formatear teléfono para MP
function formatPhoneNumber(phone: string) {
  // Limpiamos el teléfono de cualquier caracter no numérico
  const cleaned = phone.replace(/\D/g, '')
  // Asumimos que los primeros 2-3 dígitos son el código de área
  const areaCode = cleaned.slice(0, cleaned.length === 10 ? 2 : 3)
  const number = cleaned.slice(areaCode.length)
  
  return {
    area_code: areaCode,
    number
  }
}

// Crear preferencia de pago
// src/lib/mercadopago/index.ts

export async function createPaymentPreference(
  orderId: string,
  items: CartItem[],
  customer: Customer
): Promise<MercadoPagoPreferenceResponse> {
  const preference: MercadoPagoPreference = {
    items: items.map(item => ({
      id: item.productId,
      title: item.product.name,
      description: item.product.description || '',
      picture_url: item.product.images[0],
      category_id: 'others',
      quantity: item.quantity,
      currency_id: 'ARS',
      unit_price: item.priceAtPurchase
    })),
    payer: {
      name: customer.firstName,
      surname: customer.lastName,
      email: customer.email,
      phone: {
        area_code: '',
        number: customer.phone
      },
      identification: {
        type: 'DNI',
        number: customer.dni
      },
      address: {
        street_name: customer.street,
        street_number: customer.streetNumber,
        zip_code: customer.zipCode
      }
    },
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
      pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`
    },
    notification_url: MERCADOPAGO_CONFIG.WEBHOOK_URL,
    statement_descriptor: MERCADOPAGO_CONFIG.STORE_NAME,
    external_reference: orderId,
    expires: true,
    auto_return: 'approved'
  }


  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer APP_USR-85580567507693-021016-f0613f55350f73fd1491405b83328c30-1541952501`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(preference)
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    console.error('MP Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
      preference: preference
    })
    return Promise.reject('Error creating preference')
  }
  
  return response.json()
}

// Verificar estado de un pago
export async function getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_CONFIG.ACCESS_TOKEN}`,
        'X-Integrator-Id': MERCADOPAGO_CONFIG.INTEGRATOR_ID
      }
    })

    if (!response.ok) {
      throw new Error('Error getting payment status')
    }

    const payment = await response.json()
    return payment.status as PaymentStatus
  } catch (error) {
    console.error('Error in getPaymentStatus:', error)
    throw error
  }
}

// Verificar firma del webhook
export function verifyWebhookSignature(
  signature: string,
  timestamp: string,
  id: string,
  topic: string
): boolean {
  try {
    // Implementar verificación de firma según documentación de MP
    // Por ahora retornamos true
    return true
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}