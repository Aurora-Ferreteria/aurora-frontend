import { getRequest, type HttpResponse } from './service-http'

export interface IdType {
  id: string
  name: string
}

export async function getIdTypes(): Promise<HttpResponse<IdType[]>> {
  return await getRequest<IdType[]>('/api/v1/id-types')
}
