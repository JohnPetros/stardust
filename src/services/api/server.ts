import { IServer } from './interfaces/IServer'

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL
const HEADERS = {
  'Content-Type': 'application/json',
}

export const Server = (): IServer => {
  return {
    async get<Response>(url: string): Promise<Response> {
      const response = await fetch(`${BASE_URL}/${url}`)

      const data = await response.json()

      console.log({ response })

      return data as Response
    },

    async post<Response>(url: string, body: string): Promise<Response> {
      const response = await fetch(`${BASE_URL}/${url}`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          body,
        }),
      })

      const data = await response.json()

      return data as Response
    },

    async delete<Response>(url: string) {
      const response = await fetch(`${BASE_URL}/${url}`, {
        method: 'DELETE',
        headers: HEADERS,
      })

      const data = response.json()

      return data as Response
    },
  }
}
