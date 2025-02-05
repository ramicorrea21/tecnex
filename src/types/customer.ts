export interface Customer {
    id: string
    firstName: string
    lastName: string
    dni: string
    email: string
    street: string
    streetNumber: string
    zipCode: string
    orderIds: string[]
    createdAt: Date
    updatedAt: Date
  }
  
  export interface CustomerFormData {
    firstName: string
    lastName: string
    dni: string
    email: string
    street: string
    streetNumber: string
    zipCode: string
  }