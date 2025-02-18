// src/components/emails/OrderStatusEmail.tsx
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
  } from '@react-email/components'
  import type { Order } from '@/types/order'
  import type { Customer } from '@/types/customer'
  import { formatPrice } from '@/lib/cart-utils'
  
  interface OrderEmailProps {
    order: Order
    customer: Customer
  }
  
  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PAYMENT_CONFIRMED':
        return {
          title: '¡Tu pago ha sido confirmado!',
          message: 'Gracias por tu compra. Estamos preparando tu pedido.'
        }
      case 'DISPATCHED':
        return {
          title: '¡Tu pedido está en camino!',
          message: 'Tu pedido ha sido despachado y está en camino.'
        }
      case 'IN_TRANSIT':
        return {
          title: 'Tu pedido está en tránsito',
          message: 'Tu pedido está siendo transportado hacia tu dirección.'
        }
      case 'DELIVERED':
        return {
          title: '¡Tu pedido ha sido entregado!',
          message: 'Tu pedido ha sido entregado con éxito.'
        }
      default:
        return {
          title: 'Actualización de tu pedido',
          message: 'El estado de tu pedido ha sido actualizado.'
        }
    }
  }
  
  export function OrderStatusEmail({ order, customer }: OrderEmailProps) {
    const statusInfo = getStatusMessage(order.status)
  
    return (
      <Html>
        <Head />
        <Preview>{statusInfo.title}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={h1}>{statusInfo.title}</Heading>
            
            <Text style={text}>
              Hola {customer.firstName},
            </Text>
            
            <Text style={text}>
              {statusInfo.message}
            </Text>
  
            <Text style={text}>
              <strong>Número de orden:</strong> {order.id}
            </Text>
  
            <Text style={text}>
              <strong>Estado actual:</strong> {order.status}
            </Text>
  
            <Text style={orderSummary}>Resumen de tu pedido:</Text>
            
            {order.items.map((item) => (
              <Text key={item.productId} style={text}>
                {item.quantity}x - ${formatPrice(item.priceAtPurchase * item.quantity)}
              </Text>
            ))}
  
            <Text style={total}>
              Total: {formatPrice(order.totalAmount)}
            </Text>
  
            <Text style={text}>
              Si tienes alguna pregunta, no dudes en contactarnos.
            </Text>
  
            <Text style={footer}>
              Gracias por tu compra!
            </Text>
          </Container>
        </Body>
      </Html>
    )
  }
  
  // Estilos
  const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  }
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px',
  }
  
  const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0',
    padding: '0',
  }
  
  const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '16px 0',
  }
  
  const orderSummary = {
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '24px 0 16px',
  }
  
  const total = {
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '24px 0',
  }
  
  const footer = {
    color: '#898989',
    fontSize: '14px',
    margin: '24px 0',
  }