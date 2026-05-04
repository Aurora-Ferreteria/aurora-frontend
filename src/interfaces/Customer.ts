export interface CustomerInterface {
  identificationType: {
    id: string
  }
  identificationNumber: string
  fullName: string
  phoneNumber: string
  birthDate: string
}

export interface Customer {
  id: string
  identificationType: {
    id: string
    name: string
  }
  identificationNumber: string
  fullName: string
  phoneNumber: string
  birthDate: string
}
