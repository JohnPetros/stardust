const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL
const HEADERS = {
  'Content-Type': 'application/json',
}

export function Server() {
  return {
    async get<Response>(url: string): Promise<Response> {
      const response = await fetch(`${BASE_URL}/${url}`)

      const data = await response.json()

      return data as Response
    },

    async post<Response>(
      url: string,
      body: unknown,
      cacheConfig: RequestCache = 'default'
    ): Promise<Response> {
      const response = await fetch(`${BASE_URL}/${url}`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(body),
        cache: cacheConfig,
      })

      const data = await response.json()

      return data as Response
    },

    async delete(url: string) {
      await fetch(`${BASE_URL}/${url}`, {
        method: 'DELETE',
        headers: HEADERS,
      })
    },
  }
}
