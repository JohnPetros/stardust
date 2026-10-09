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

  function setAuthorizationToken(token: string) {
    requestInit.headers = {
      ...requestInit.headers,
      [HTTP_HEADERS.authorization]: `Bearer ${token}`,
    }
  }

  async function getFromUrl<Body>(url: string): Promise<RestResponse<Body>> {
    const response = await fetch(url, {
      ...requestInit,
      method: 'GET',
    })

    if (!response.ok) {
      return await handleRestError<Body>(
        response,
        async () => await getFromUrl<Body>(url),
        (session) => setAuthorizationToken(session.accessToken),
      )
    }

    const data = await parseResponseJson(response)

    if (response.headers.get(HTTP_HEADERS.xPaginationResponse)) {
      const totalItemsCount =
        Number(response.headers.get(HTTP_HEADERS.xTotalItemsCount)) || 0
      const itemsPerPage = Number(response.headers.get(HTTP_HEADERS.xItemsPerPage)) || 0
      const page = Number(response.headers.get(HTTP_HEADERS.xPage)) || 1

      return new RestResponse<Body>({
        body: new PaginationResponse({
          items: data,
          totalItemsCount,
          itemsPerPage,
          page,
        }) as Body,
        statusCode: response.status,
      })
    }

    return new RestResponse({ body: data, statusCode: response.status })
  }

  function getFileName(headers: Headers, fallbackName: string): string {
    const contentDisposition = headers.get('content-disposition')
    if (!contentDisposition) return fallbackName

    const match = contentDisposition.match(/filename="?([^";]+)"?/i)
    return match?.[1] ?? fallbackName
  }

  return {
    async get<Body>(route: string): Promise<RestResponse<Body>> {
      const url = `${baseUrl}${addQueryParams(route, queryParams)}`
      this.clearQueryParams()
      return await getFromUrl<Body>(url)
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
          (session) => this.setAuthorization(session.accessToken),
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
          (session) => this.setAuthorization(session.accessToken),
        )
      }

      const data = await parseResponseJson(response)
      return new RestResponse({
        body: data,
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      })
    },

    async postFormData<Body>(route: string, body: FormData): Promise<RestResponse<Body>> {
      const headers = createMultipartHeaders(requestInit.headers)
      return sendJsonRequest<Body>(route, { method: 'POST', headers }, () => body, {
        retry: () => this.postFormData<Body>(route, body),
        onRefreshSuccess: (session) => this.setAuthorization(session.accessToken),
        includeHeaders: true,
      })
    },

    async put<Body>(route: string, body: unknown): Promise<RestResponse<Body>> {
      return sendJsonRequest<Body>(route, { method: 'PUT' }, () => JSON.stringify(body), {
        retry: () => this.put<Body>(route, body),
        onRefreshSuccess: (session) => this.setAuthorization(session.accessToken),
      })
    },

    async patch<Body>(route: string, body: unknown): Promise<RestResponse<Body>> {
      return sendJsonRequest<Body>(
        route,
        { method: 'PATCH' },
        () => JSON.stringify(body),
        {
          retry: () => this.patch<Body>(route, body),
          onRefreshSuccess: (session) => this.setAuthorization(session.accessToken),
        },
      )
    },

    async delete<Body>(route: string, body?: unknown): Promise<RestResponse<Body>> {
      return sendJsonRequest<Body>(
        route,
        { method: 'DELETE' },
        () => (body ? JSON.stringify(body) : undefined),
        {
          retry: () => this.delete<Body>(route, body),
          onRefreshSuccess: (session) => this.setAuthorization(session.accessToken),
        },
      )
    },

    setBaseUrl(url: string): void {
      baseUrl = url
    },

    setAuthorization(token: string): void {
      setAuthorizationToken(token)
    },

    setHeader(key: string, value: string): void {
      requestInit.headers = { ...requestInit.headers, [key]: value }
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

  function sendJsonRequest<Body>(
    route: string,
    init: RequestInit,
    getBody: () => BodyInit | undefined,
    { retry, onRefreshSuccess, includeHeaders = false }: JsonResponseOptions<Body>,
  ): Promise<RestResponse<Body>> {
    return fetch(`${baseUrl}${addQueryParams(route, queryParams)}`, {
      ...requestInit,
      ...init,
      body: getBody(),
    }).then((response) =>
      resolveJsonResponse<Body>(response, retry, onRefreshSuccess, includeHeaders),
    )
  }
}

async function createJsonResponse<Body>(response: Response, includeHeaders: boolean) {
  return new RestResponse<Body>({
    body: await parseResponseJson(response),
    statusCode: response.status,
    ...(includeHeaders && { headers: Object.fromEntries(response.headers.entries()) }),
  })
}

function createMultipartHeaders(headers: RequestInit['headers']) {
  const { 'Content-Type': _, ...multipartHeaders } = headers as Record<string, string>
  return multipartHeaders
}

type JsonResponseOptions<Body> = {
  retry: () => Promise<RestResponse<Body>>
  onRefreshSuccess: Parameters<typeof handleRestError>[2]
  includeHeaders?: boolean
}

function resolveJsonResponse<Body>(
  response: Response,
  retry: () => Promise<RestResponse<Body>>,
  onRefreshSuccess: Parameters<typeof handleRestError>[2],
  includeHeaders: boolean,
) {
  if (!response.ok) {
    return handleRestError<Body>(response, retry, onRefreshSuccess)
  }
  return createJsonResponse<Body>(response, includeHeaders)
}
