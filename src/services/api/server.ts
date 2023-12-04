import { IServer } from './interfaces/IServer'

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL
const HEADERS = {
  'Content-Type': 'application/json',
}

export const Server = (): IServer => {
  return {
    async get<Data>(url: string): Promise<Data> {
      const response = await fetch(`${BASE_URL}/${url}`)

      const data = response.json()

      return data as Data
    },

    async post<Data>(url: string, body: string): Promise<Data> {
      const response = await fetch(`${BASE_URL}/${url}`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          body,
        }),
      })

      const data = response.json()

      return data as Data
    },
  }
}
