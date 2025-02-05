export const MERCADOPAGO_CONFIG = {
    INTEGRATOR_ID: 'dev_468c3433023911efbc71fac228663d7f',
    PUBLIC_KEY: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!,
    ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN!,
    WEBHOOK_SECRET: process.env.MP_WEBHOOK_SECRET!,
    // URLs base para desarrollo y producción
    SUCCESS_URL: process.env.NODE_ENV === 'production' 
      ? 'https://tudominio.com/checkout/success'
      : 'http://localhost:3000/checkout/success',
    FAILURE_URL: process.env.NODE_ENV === 'production'
      ? 'https://tudominio.com/checkout/failure'
      : 'http://localhost:3000/checkout/failure',
    PENDING_URL: process.env.NODE_ENV === 'production'
      ? 'https://tudominio.com/checkout/pending'
      : 'http://localhost:3000/checkout/pending',
    WEBHOOK_URL: process.env.NODE_ENV === 'production'
      ? 'https://tudominio.com/api/webhook/mercadopago'
      : 'http://localhost:3000/api/webhook/mercadopago',
    STORE_NAME: 'Tu Tienda'
  } as const