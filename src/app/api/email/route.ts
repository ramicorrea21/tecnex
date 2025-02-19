// src/app/api/email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/config/email'
import { OrderStatusEmail } from '@/components/emails/OrderStatusEmail'
import { getOrder } from '@/lib/firebase/orders'
import { getCustomer } from '@/lib/firebase/customers'

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()
    console.log("📧 Email request received:", { orderId, status });
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Obtenemos la orden
    const order = await getOrder(orderId)
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Obtenemos el cliente
    const customer = await getCustomer(order.customerId)
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Enviamos el email
    console.log("📧 Sending email to:", customer.email);
    
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', // Usa este hasta que verifiques tu dominio
      to: customer.email,
      subject: `Actualización de tu orden #${order.id.substring(0, 8)}`,
      react: OrderStatusEmail({ order, customer })
    })
    
    console.log("📧 Email sent successfully:", result);
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('📧 Error sending email:', error)
    return NextResponse.json(
      { error: `Failed to send email: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}