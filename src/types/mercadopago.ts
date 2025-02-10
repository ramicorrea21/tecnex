export interface MercadoPagoItem {
    id: string
    title: string
    description: string
    picture_url?: string
    category_id?: string
    quantity: number
    currency_id: string
    unit_price: number
  }
  
  export interface MercadoPagoPreference {
    items: MercadoPagoItem[]
    payer: {
      name: string
      surname: string 
      email: string
      phone: {
        area_code: string
        number: string
      }
      identification: {
        type: string
        number: string
      }
      address: {
        street_name: string
        street_number: string
        zip_code: string 
      }
    }
    back_urls: {
      success: string
      failure: string
      pending: string
    }
    notification_url: string
    statement_descriptor: string
    external_reference: string
    expires: boolean
    auto_return: string
   }
  export interface MercadoPagoPreferenceResponse {
    id: string
    init_point: string
    sandbox_init_point: string
  }
  
  export type PaymentStatus = 'approved' | 'pending' | 'rejected'
  
  export interface PaymentNotification {
    id: string
    live_mode: boolean
    type: 'payment'
    date_created: string
    application_id: string
    user_id: string
    version: number
    api_version: string
    action: string
    data: {
      id: string
    }
  }