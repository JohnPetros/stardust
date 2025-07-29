import type { AxiosInstance } from 'axios'

import type { RestClient } from '@stardust/core/global/interfaces'
import { PaginationResponse, RestResponse } from '@stardust/core/global/responses'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { createAxiosInstance, normalizeHeaders, handleError, buildUrl } from './utils'

export const AxiosRestClient = (): RestClient => {
  let baseUrl = ''
  const headers: Record<string, string> = {}
  let queryParams: Record<string, string | string[]> = {}
  let axios: AxiosInstance = createAxiosInstance()

  function updateAxios() {
    axios = createAxiosInstance(baseUrl, headers)
  }

  return {
    async get<Body>(route: string): Promise<RestResponse<Body>> {
      try {
        const response = await axios.get(buildUrl(route, baseUrl, queryParams))
        const headers = normalizeHeaders(response.headers)
        const data = response.data

        if (headers[HTTP_HEADERS.xPaginationResponse.toLowerCase()]) {
          const totalItems = Number(headers[HTTP_HEADERS.xTotalItemsCount])
          const itemsPerPage = Number(headers[HTTP_HEADERS.xItemsPerPage])
          return new RestResponse<Body>({
            body: new PaginationResponse(data, totalItems, itemsPerPage) as Body,
            statusCode: response.status,
            headers,
          })
        }

        this.clearQueryParams()
        return new RestResponse({ body: data, statusCode: response.status, headers })
      } catch (error) {
        return await handleError<Body>(error)
      }
    },

    async post<Body>(route: string, body?: unknown): Promise<RestResponse<Body>> {
      try {
        const response = await axios.post(buildUrl(route, baseUrl, queryParams), body)
        const headers = normalizeHeaders(response.headers)

        return new RestResponse({
          body: response.data,
          statusCode: response.status,
          headers: [],
        })
      } catch (error) {
        return await handleError<Body>(error)
      }
    },

    async postFormData<Body>(route: string, body: FormData): Promise<RestResponse<Body>> {
      try {
        const response = await axios.post(buildUrl(route, baseUrl, queryParams), body, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        const headers = normalizeHeaders(response.headers)
        return new RestResponse({
          body: response.data,
          statusCode: response.status,
          headers,
        })
      } catch (error) {
        return await handleError<Body>(error)
      }
    },

    async put<Body>(route: string, body?: unknown): Promise<RestResponse<Body>> {
      try {
        const response = await axios.put(buildUrl(route, baseUrl, queryParams), body)
        const headers = normalizeHeaders(response.headers)

        return new RestResponse({
          body: response.data,
          statusCode: response.status,
          headers,
        })
      } catch (error) {
        return await handleError<Body>(error)
      }
    },

    async patch<Body>(route: string, body?: unknown): Promise<RestResponse<Body>> {
      try {
        const response = await axios.patch(buildUrl(route, baseUrl, queryParams), body)
        const headers = normalizeHeaders(response.headers)
        return new RestResponse({
          body: response.data,
          statusCode: response.status,
          headers,
        })
      } catch (error) {
        return await handleError<Body>(error)
      }
    },

    async delete(route: string) {
      try {
        const response = await axios.delete(buildUrl(route, baseUrl, queryParams))
        const headers = normalizeHeaders(response.headers)
        return new RestResponse({ statusCode: response.status, headers })
      } catch (error) {
        return await handleError<void>(error)
      }
    },

    setBaseUrl(url: string): void {
      baseUrl = url
      updateAxios()
    },

    setHeader(key: string, value: string): void {
      headers[key] = value
      updateAxios()
    },

    setQueryParam(key: string, value: string | string[]): void {
      queryParams[key] = value
    },

    clearQueryParams(): void {
      queryParams = {}
    },
  }
}
