import type { CustomerInterface, Customer } from '../interfaces/Customer'
import { getRequest, postRequest, type HttpResponse } from './service-http'

// Definimos que la respuesta exitosa contiene un objeto con la propiedad 'data'
export async function getCustomers(): Promise<HttpResponse<{ data: Customer[] }>> {
  return await getRequest<{ data: Customer[] }>('/api/v1/customers')
}

export async function registerCustomer(
  data: CustomerInterface,
): Promise<HttpResponse<{ id: number }>> {
  return await postRequest<{ id: number }, CustomerInterface>('/api/v1/customers', data)
}
