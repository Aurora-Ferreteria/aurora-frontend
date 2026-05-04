export type HttpResponse<Response> = {
  success?: Response
  error?: string
}

const BASE_URL = 'http://localhost:8080'

// GET
export async function getRequest<Response>(endpoint: string): Promise<HttpResponse<Response>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
    })

    if (response.status !== 200) {
      const errorData = await response.json().catch(() => null)
      if (errorData?.messages?.length > 0) {
        return { error: errorData.messages[0] }
      }
      return { error: `Error: ${response.status} - ${response.statusText}` }
    }

    const data = (await response.json()) as Response
    return { success: data }
  } catch (error) {
    console.error('Error de Red (Fetch):', error)
    return { error: 'Error de Red: No se pudo establecer conexión con el servidor.' }
  }
}

// POST
export async function postRequest<Response, T = object>(
  endpoint: string,
  body: T, // <--- Ahora acepta exactamente el tipo que le pases
): Promise<HttpResponse<Response>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (![200, 201, 204].includes(response.status)) {
      const errorData = await response.json().catch(() => null)
      if (errorData?.messages?.length > 0) {
        return { error: errorData.messages[0] }
      }
      return { error: `Error: ${response.status} - ${response.statusText}` }
    }

    const data = response.status !== 204 ? await response.json() : null
    return { success: data as Response }
  } catch (error) {
    console.error('Error de Red (Fetch):', error)
    return { error: 'Error de Red: No se pudo conectar con el servidor.' }
  }
}
