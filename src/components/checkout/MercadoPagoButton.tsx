'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { MERCADOPAGO_CONFIG } from '@/config/mercadopago'

declare global {
  interface Window {
    MercadoPago: any
  }
}

interface MercadoPagoButtonProps {
  preferenceId: string
  onSuccess?: () => void
  onFailure?: () => void
  onPending?: () => void
}

export function MercadoPagoButton({ 
  preferenceId,
  onSuccess,
  onFailure,
  onPending 
}: MercadoPagoButtonProps) {
  useEffect(() => {
    // Inicializar el botón cuando el script está cargado
    if (window.MercadoPago && preferenceId) {
      const mp = new window.MercadoPago(MERCADOPAGO_CONFIG.PUBLIC_KEY, {
        locale: 'es-AR'
      })

      mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '#mp-wallet-button',
          label: 'Pagar con Mercado Pago'
        },
        theme: {
          elementsColor: '#000000',
          headerColor: '#000000',
        }
      })
    }
  }, [preferenceId, onSuccess, onFailure, onPending])

  return (
    <>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        strategy="lazyOnload"
      />
      <div id="mp-wallet-button" className="w-full h-24" />
    </>
  )
}