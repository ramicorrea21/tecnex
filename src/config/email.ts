// src/config/email.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

// Email por defecto desde donde se envían los correos
export const DEFAULT_FROM_EMAIL = 'ramicorrea021@gmail.com'