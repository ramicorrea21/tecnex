import { NextResponse } from 'next/server'
import { getPaymentStatus } from '@/lib/mercadopago'
import { updateOrderPayment } from '@/lib/firebase/orders'
import { verifyWebhookSignature } from '@/lib/mercadopago'
import type { PaymentNotification } from '@/types/mercadopago'

export async function POST(request: Request) {
  try {
    // Verificar la firma del webhook
    const signature = request.headers.get('x-signature') || ''
    const timestamp = request.headers.get('x-timestamp') || ''
    const id = request.headers.get('x-notification-id') || ''
    const topic = request.headers.get('x-topic') || ''

    const isValid = verifyWebhookSignature(signature, timestamp, id, topic)
    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Procesar la notificación
    const notification: PaymentNotification = await request.json()

    // Solo procesamos notificaciones de pagos
    if (notification.type !== 'payment') {
      return NextResponse.json(
        { message: 'Notification received but not processed' },
        { status: 200 }
      )
    }

    // Obtener el estado actual del pago
    const paymentId = notification.data.id
    const paymentStatus = await getPaymentStatus(paymentId)

    // Obtener el ID de la orden desde la referencia externa
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        }
      }
    )

    if (!response.ok) {
      throw new Error('Error getting payment details')
    }

    const paymentDetails = await response.json()
    const orderId = paymentDetails.external_reference

    // Actualizar el estado de la orden
    await updateOrderPayment(
      orderId,
      paymentId,
      paymentStatus
    )

    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}