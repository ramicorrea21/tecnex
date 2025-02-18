// src/lib/email.ts
import { resend, DEFAULT_FROM_EMAIL } from '@/config/email'
import { OrderStatusEmail } from '@/components/emails/OrderStatusEmail'
import type { Order } from '@/types/order'
import type { Customer } from '@/types/customer'

export async function sendOrderStatusEmail(order: Order, customer: Customer) {
  try {
    const result = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: customer.email,
      subject: `Actualización de tu orden #${order.id}`,
      react: OrderStatusEmail({ order, customer })
    })

    return result
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}