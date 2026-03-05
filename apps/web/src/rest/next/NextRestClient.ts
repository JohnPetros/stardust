import type { RestClient } from '@stardust/core/global/interfaces'
import { PaginationResponse, RestResponse } from '@stardust/core/global/responses'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { addQueryParams } from './utils/addQueryParams'
import { handleRestError } from './utils/handleRestError'
import { parseResponseJson } from './utils/parseResponseJson'
import type { NextRestClientConfig } from './types'

export const NextRestClient = ({
  isCacheEnabled = true,
  refetchInterval = 60,
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

  function getFileName(headers: Headers, fallbackName: string): string {
    const contentDisposition = headers.get('content-disposition')
    if (!contentDisposition) return fallbackName

    const match = contentDisposition.match(/filename="?([^";]+)"?/i)
    return match?.[1] ?? fallbackName
  }

  return {
    async get<Body>(route: string): Promise<RestResponse<Body>> {
      const response = await fetch(`${baseUrl}${addQueryParams(route, queryParams)}`, {
        ...requestInit,
        method: 'GET',
      })

      if (!response.ok) {
        return await handleRestError<Body>(
          response,
          async () => await this.get<Body>(route),
        )
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

    async getFile(route: string): Promise<RestResponse<File>> {
      const response = await fetch(`${baseUrl}${addQueryParams(route, queryParams)}`, {
        ...requestInit,
        method: 'GET',
      })

      if (!response.ok) {
        return await handleRestError<File>(
          response,
          async () => await this.getFile(route),
        )
      }

      const blob = await response.blob()
      const fileName = getFileName(response.headers, 'download.bin')
      const file = new File([blob], fileName, {
        type: response.headers.get('content-type') || 'application/octet-stream',
        lastModified: Date.now(),
      })

      this.clearQueryParams()
      return new RestResponse({
        body: file,
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      })
    },

    async post<Body>(route: string, body: unknown): Promise<RestResponse<Body>> {
      const response = await fetch(`${baseUrl}${addQueryParams(route, queryParams)}`, {
        ...requestInit,
        method: 'POST',
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        return await handleRestError<Body>(
          response,
          async () => await this.post<Body>(route, body),
        )
      }

      const data = await parseResponseJson(response)
      return new RestResponse({ body: data, statusCode: response.status })
    },

    async postFormData<Body>(route: string, body: FormData): Promise<RestResponse<Body>> {
      const { 'Content-Type': _, ...headers } = requestInit.headers as Record<
        string,
        string
      >

      const response = await fetch(`${baseUrl}${addQueryParams(route, queryParams)}`, {
        ...requestInit,
        method: 'POST',
        headers,
        body,
      })

      if (!response.ok) {
        return await handleRestError<Body>(
          response,
          async () => await this.postFormData<Body>(route, body),
        )
      }

      const data = await parseResponseJson(response)
      return new RestResponse({
        body: data,
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      })
    },

    async put<Body>(route: string, body: unknown): Promise<RestResponse<Body>> {
      const response = await fetch(`${baseUrl}${addQueryParams(route, queryParams)}`, {
        ...requestInit,
        method: 'PUT',
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        return await handleRestError<Body>(
          response,
          async () => await this.put(route, body),
        )
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
        return await handleRestError<Body>(
          response,
          async () => await this.patch<Body>(route, body),
        )
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
        return await handleRestError(response, async () => await this.delete(route))
      }

      return new RestResponse({ statusCode: response.status })
    },

    setBaseUrl(url: string): void {
      baseUrl = url
    },

    setAuthorization(token: string): void {
      requestInit.headers = {
        ...requestInit.headers,
        [HTTP_HEADERS.authorization]: `Bearer ${token}`,
      }
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
