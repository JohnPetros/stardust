import { headers } from 'next/headers'

import type { RestClient } from '@stardust/core/global/interfaces'
import { RestResponse, PaginationResponse } from '@stardust/core/global/responses'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { CLIENT_ENV } from '@/constants'
import { addQueryParams, handleApiError } from './utils'

type CacheConfig = {
  isCacheEnabled?: boolean
  refetchInterval?: number
  cacheKey?: string
}

export const NextRestClient = ({
  isCacheEnabled = true,
  refetchInterval = 60 * 60 * 24, // 1 day
  cacheKey,
}: CacheConfig = {}): RestClient => {
  const requestInit: RequestInit = {
    cache: !isCacheEnabled ? 'no-store' : undefined,
    headers: headers(),
    next: isCacheEnabled
      ? {
          revalidate: refetchInterval,
          tags: cacheKey ? [cacheKey] : [],
        }
      : undefined,
  }
  const queryParams: Record<string, string> = {}

  return {
    async get<Body>(route: string): Promise<RestResponse<Body>> {
      const response = await fetch(
        `${CLIENT_ENV.appHost}${addQueryParams(route, queryParams)}`,
        requestInit,
      )

      if (!response.ok) {
        return await handleApiError<Body>(response)
      }

      const data = await response.json()

      if (response.headers.get(HTTP_HEADERS.xPaginationResponse)) {
        return new RestResponse<Body>({
          body: new PaginationResponse(
            data.items,
            Number(response.headers.get(HTTP_HEADERS.xTotalItemsCount)),
            Number(response.headers.get(HTTP_HEADERS.xItemsPerPage)),
          ) as Body,
        })
      }

      return new RestResponse({ body: data, statusCode: response.status })
    },

    async post<Body>(route: string, body: unknown): Promise<RestResponse<Body>> {
      const response = await fetch(
        `${CLIENT_ENV.appHost}/${addQueryParams(route, queryParams)}`,
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
