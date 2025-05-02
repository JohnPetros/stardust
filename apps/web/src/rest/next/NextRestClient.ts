import { headers } from 'next/headers'

import { ENV } from '@/constants'
import { RestResponse, PaginationResponse } from '@stardust/core/global/responses'
import type { RestClient } from '@stardust/core/global/interfaces'

import { addQueryParams, handleApiError } from './utils'

type CacheConfig = {
  isCacheEnable?: boolean
  refetchInterval?: number
  cacheKeys?: string[]
}

export const NextRestClient = ({
  isCacheEnable = true,
  refetchInterval = 60 * 60 * 24, // 1 day
  cacheKeys = [],
}: CacheConfig = {}): RestClient => {
  const requestInit: RequestInit = {
    cache: !isCacheEnable ? 'no-store' : undefined,
    headers: headers(),
    next: isCacheEnable
      ? {
          revalidate: refetchInterval,
          tags: cacheKeys,
        }
      : undefined,
  }
  const queryParams: Record<string, string> = {}

  return {
    async get<Body>(route: string): Promise<RestResponse<Body>> {
      const response = await fetch(
        `${ENV.appHost}${addQueryParams(route, queryParams)}`,
        requestInit,
      )

      if (!response.ok) {
        return await handleApiError<Body>(response)
      }

      const data = await response.json()

      if (response.headers.get('X-Pagination')) {
        return new RestResponse<Body>({
          body: new PaginationResponse(data.items, data.count) as Body,
        })
      }

      return new RestResponse({ body: data, statusCode: response.status })
    },

    async post<Body>(route: string, body: unknown): Promise<RestResponse<Body>> {
      const response = await fetch(
        `${ENV.appHost}/${addQueryParams(route, queryParams)}`,
        {
          ...requestInit,
          method: 'POST',
          body: JSON.stringify(body),
        },
      )

      if (!response.ok) {
        return await handleApiError<Body>(response)
      }

      const data = await response.json()
      return new RestResponse({ body: data, statusCode: response.status })
    },

    setQueryParam(key: string, value: string) {
      queryParams[key] = value
    },
  }
}
