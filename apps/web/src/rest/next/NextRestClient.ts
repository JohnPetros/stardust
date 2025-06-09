import type { RestClient } from '@stardust/core/global/interfaces'
import { PaginationResponse, RestResponse } from '@stardust/core/global/responses'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { addQueryParams, handleRestError, parseResponseJson } from './utils'
import type { NextRestClientConfig } from './types'

export const NextRestClient = ({
  isCacheEnabled = false,
  refetchInterval = 60 * 60 * 24, // 1 day
  cacheKey,
  headers = new Headers(),
}: NextRestClientConfig = {}): RestClient => {
  let baseUrl: string
  const requestHeaders = {
    ...Object.fromEntries(headers),
    'Content-Type': 'application/json',
  }

  const requestInit: RequestInit = {
    cache: !isCacheEnabled ? 'no-store' : undefined,
    headers: requestHeaders,
    next: isCacheEnabled
      ? {
          revalidate: refetchInterval,
          tags: cacheKey ? [cacheKey] : [],
        }
      : undefined,
  }
  let queryParams: Record<string, string> = {}

  return {
    async get<Body>(route: string): Promise<RestResponse<Body>> {
      console.log(Object.entries(queryParams))
      const response = await fetch(`${baseUrl}${addQueryParams(route, queryParams)}`, {
        ...requestInit,
        method: 'GET',
      })

      if (!response.ok) {
        return await handleRestError<Body>(response)
      }

      const data = await parseResponseJson(response)

      if (response.headers.get(HTTP_HEADERS.xPaginationResponse)) {
        return new RestResponse<Body>({
          body: new PaginationResponse(
            data,
            Number(response.headers.get(HTTP_HEADERS.xTotalItemsCount)),
            Number(response.headers.get(HTTP_HEADERS.xItemsPerPage)),
          ) as Body,
        })
      }

      this.clearQueryParams()
      return new RestResponse({ body: data, statusCode: response.status })
    },

    async post<Body>(route: string, body: unknown): Promise<RestResponse<Body>> {
      const response = await fetch(`${baseUrl}${addQueryParams(route, queryParams)}`, {
        ...requestInit,
        method: 'POST',
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        return await handleRestError<Body>(response)
      }

      const data = await parseResponseJson(response)
      return new RestResponse({ body: data, statusCode: response.status })
    },

    async put<Body>(route: string, body: unknown): Promise<RestResponse<Body>> {
      const response = await fetch(`${baseUrl}${addQueryParams(route, queryParams)}`, {
        ...requestInit,
        method: 'PUT',
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        return await handleRestError<Body>(response)
      }

      const data = await parseResponseJson(response)
      return new RestResponse({ body: data, statusCode: response.status })
    },

    async patch<Body>(route: string, body: unknown): Promise<RestResponse<Body>> {
      const response = await fetch(`${baseUrl}${addQueryParams(route, queryParams)}`, {
        ...requestInit,
        method: 'PATCH',
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        return await handleRestError<Body>(response)
      }

      const data = await parseResponseJson(response)
      return new RestResponse({ body: data, statusCode: response.status })
    },

    async delete(route: string) {
      const response = await fetch(`${baseUrl}${addQueryParams(route, queryParams)}`, {
        ...requestInit,
        method: 'DELETE',
      })

      if (!response.ok) {
        return await handleRestError<void>(response)
      }

      return new RestResponse({ statusCode: response.status })
    },

    setBaseUrl(url: string): void {
      baseUrl = url
    },

    setHeader(key: string, value: string): void {
      if (requestInit.headers) {
        requestInit.headers = {
          ...requestInit.headers,
          [key]: value,
        }
        return
      }

      requestInit.headers = {
        [key]: value,
      }
    },

    setQueryParam(key: string, value: string | string[]): void {
      if (Array.isArray(value)) {
        queryParams[key.concat('[]')] = value.join(',')
      } else {
        queryParams[key] = value
      }
    },

    clearQueryParams(): void {
      queryParams = {}
    },
  }
}
