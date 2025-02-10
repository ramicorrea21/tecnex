export const MERCADOPAGO_CONFIG = {
  INTEGRATOR_ID: 'dev_468c3433023911efbc71fac228663d7f',
  PUBLIC_KEY: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!,
  ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN!,
  WEBHOOK_SECRET: process.env.MP_WEBHOOK_SECRET!,
  SUCCESS_URL: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
  FAILURE_URL: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
  PENDING_URL: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
  WEBHOOK_URL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mercadopago`,
  STORE_NAME: 'tecnex'
 } as const