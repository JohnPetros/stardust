import { headers } from 'next/headers'

import type { IApiClient } from '@/@core/interfaces/handlers'
import { HttpResponse } from '@/@core/responses'
import { ENV } from '@/modules/global/constants'

type CacheConfig = {
  isCacheEnable?: boolean
  refetchInterval?: number
}

export const NextApiClient = ({ isCacheEnable = true }: CacheConfig = {}): IApiClient => {
  const requestInit: RequestInit = {
    cache: !isCacheEnable ? 'force-cache' : 'no-store',
    headers: headers(),
  }

  return {
    async get<Response>(route: string): Promise<HttpResponse<Response>> {
      const response = await fetch(`${ENV.url}${route}`, requestInit)

      const data = await response.json()

      return new HttpResponse(data, response.status)
    },

    async post<Response>(route: string, body: unknown): Promise<HttpResponse<Response>> {
      const response = await fetch(`${ENV.url}${route}`, {
        ...requestInit,
        method: 'POST',
        body: JSON.stringify(body),
      })

      const data = await response.json()

      return new HttpResponse(data, response.status)
    },
  }
}
