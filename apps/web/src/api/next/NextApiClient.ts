import { headers } from 'next/headers'

import { ENV } from '@/constants'
import type { IApiClient } from '@stardust/core/interfaces'
import { ApiResponse, PaginationResponse } from '@stardust/core/responses'
import { handleApiError } from './utils'

type CacheConfig = {
  isCacheEnable?: boolean
  refetchInterval?: number
  cacheKeys?: string[]
}

export const NextApiClient = ({
  isCacheEnable = true,
  refetchInterval = 3600 * 24, // 1 day
  cacheKeys,
}: CacheConfig = {}): IApiClient => {
  const requestInit: RequestInit = {
    cache: !isCacheEnable ? 'force-cache' : 'no-store',
    headers: headers(),
    next: isCacheEnable
      ? {
          revalidate: refetchInterval,
          tags: cacheKeys,
        }
      : undefined,
  }

  return {
    async get<Body>(route: string): Promise<ApiResponse<Body>> {
      const response = await fetch(`${ENV.url}${route}`, requestInit)

      if (!response.ok) {
        return await handleApiError<Body>(response)
      }

      const data = await response.json()

      if (response.headers.get('X-Pagination')) {
        return new ApiResponse<Body>({
          body: new PaginationResponse(data.items, data.count) as Body,
        })
      }

      return new ApiResponse({ body: data, statusCode: response.status })
    },

    async post<Body>(route: string, body: unknown): Promise<ApiResponse<Body>> {
      const response = await fetch(`${ENV.url}${route}`, {
        ...requestInit,
        method: 'POST',
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        return await handleApiError<Body>(response)
      }

      const data = await response.json()
      return new ApiResponse({ body: data, statusCode: response.status })
    },
  }
}
