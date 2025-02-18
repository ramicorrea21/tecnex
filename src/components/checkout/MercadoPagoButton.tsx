'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface MercadoPagoButtonProps {
 preferenceId: string
 onSuccess?: () => void
 onFailure?: () => void
 onPending?: () => void
}

declare global {
 interface Window {
   MercadoPago: any
 }
}

export function MercadoPagoButton({
 preferenceId,
 onSuccess,
 onFailure,
 onPending
}: MercadoPagoButtonProps) {
 const [sdkLoaded, setSdkLoaded] = useState(false)

 useEffect(() => {
   if (sdkLoaded && preferenceId) {
     console.log("Iniciando MP con:", preferenceId)
     try {
      const mp = new window.MercadoPago('APP_USR-3e907310-8579-4618-a3f6-db25022479e5', {
        locale: 'es-AR'
      })
       
       mp.bricks().create("wallet", "wallet_container", {
         initialization: {
           preferenceId: preferenceId
         },
         customization: {
           texts: {
             action: 'pay',
             valueProp: 'security_safety'
           }
         }
       })
     } catch (error) {
       console.error("Error inicializando MP:", error)
     }
   }
 }, [sdkLoaded, preferenceId, onSuccess, onFailure, onPending])

 return (
   <>
     <Script
       src="https://sdk.mercadopago.com/js/v2"
       onLoad={() => {
         console.log("SDK cargado")
         setSdkLoaded(true)
       }}
     />
     <div 
       id="wallet_container" 
       className="w-full min-h-[200px] flex items-center justify-center"
     />
   </>
 )
}