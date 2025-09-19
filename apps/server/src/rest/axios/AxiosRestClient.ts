import axios, { type AxiosInstance, type AxiosError } from 'axios'

import type { RestClient } from '@stardust/core/global/interfaces'
import { PaginationResponse, RestResponse } from '@stardust/core/global/responses'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

export class AxiosRestClient implements RestClient {
  private baseUrl = ''
  private headers: Record<string, string> = {}
  private queryParams: Record<string, string | string[]> = {}
  private axios: AxiosInstance

  constructor(baseUrl?: string) {
    if (baseUrl) this.baseUrl = baseUrl
    this.axios = this.createAxiosInstance()
  }

  private createAxiosInstance(
    baseURL?: string,
    headers?: Record<string, string>,
  ): AxiosInstance {
    return axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  }

  private updateAxios(): void {
    this.axios = this.createAxiosInstance(this.baseUrl, this.headers)
  }

  private normalizeHeaders(headers: Record<string, unknown>): Record<string, string> {
    const result: Record<string, string> = {}
    if (!headers) return result
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === 'string') {
        result[key] = value
      } else if (Array.isArray(value)) {
        result[key] = value.join(',')
      } else if (value !== undefined && value !== null) {
        result[key] = String(value)
      }
    }
    return result
  }

  private async handleError<Body>(error: unknown): Promise<RestResponse<Body>> {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      const status = axiosError.response?.status
      const data = axiosError.response?.data
      const headers = this.normalizeHeaders(
        axiosError.response?.headers as Record<string, unknown>,
      )
      let errorMessage: string | undefined = axiosError.message

      if (typeof data === 'string') {
        errorMessage = data
      } else if (
        data &&
        typeof data === 'object' &&
        'message' in data &&
        typeof data.message === 'string'
      ) {
        errorMessage = data.message
      }
      return new RestResponse<Body>({
        statusCode: status,
        errorMessage,
        headers,
      })
    }

    console.log('Axios error', error)

    return new RestResponse<Body>({
      statusCode: 500,
      errorMessage: error instanceof Error ? error.message : String(error),
    })
  }

  private buildUrl(route: string): string {
    const baseUrl = this.baseUrl || 'http://localhost'
    const url = new URL(baseUrl + (route === '/' ? '' : route))
    Object.entries(this.queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, v))
      } else {
        url.searchParams.append(key, value)
      }
    })
    return url.toString()
  }

  async get<Body>(route: string): Promise<RestResponse<Body>> {
    try {
      const response = await this.axios.get(this.buildUrl(route))
      const headers = this.normalizeHeaders(response.headers)
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
      return await this.handleError<Body>(error)
    }
  }

  async post<Body>(route: string, body?: unknown): Promise<RestResponse<Body>> {
    try {
      const response = await this.axios.post(this.buildUrl(route), body)
      const headers = this.normalizeHeaders(response.headers)

      return new RestResponse({
        body: response.data,
        statusCode: response.status,
        headers,
      })
    } catch (error) {
      return await this.handleError<Body>(error)
    }
  }

  async postFormData<Body>(route: string, body: FormData): Promise<RestResponse<Body>> {
    try {
      const response = await this.axios.post(this.buildUrl(route), body, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const headers = this.normalizeHeaders(response.headers)
      return new RestResponse({
        body: response.data,
        statusCode: response.status,
        headers,
      })
    } catch (error) {
      return await this.handleError<Body>(error)
    }
  }

  async put<Body>(route: string, body?: unknown): Promise<RestResponse<Body>> {
    try {
      const response = await this.axios.put(this.buildUrl(route), body)
      const headers = this.normalizeHeaders(response.headers)

      return new RestResponse({
        body: response.data,
        statusCode: response.status,
        headers,
      })
    } catch (error) {
      return await this.handleError<Body>(error)
    }
  }

  async patch<Body>(route: string, body?: unknown): Promise<RestResponse<Body>> {
    try {
      const response = await this.axios.patch(this.buildUrl(route), body)
      const headers = this.normalizeHeaders(response.headers)
      return new RestResponse({
        body: response.data,
        statusCode: response.status,
        headers,
      })
    } catch (error) {
      return await this.handleError<Body>(error)
    }
  }

  async delete(route: string) {
    try {
      const response = await this.axios.delete(this.buildUrl(route))
      const headers = this.normalizeHeaders(response.headers)
      return new RestResponse({ statusCode: response.status, headers })
    } catch (error) {
      return await this.handleError<void>(error)
    }
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url
    this.updateAxios()
  }

  setHeader(key: string, value: string): void {
    this.headers[key] = value
    this.updateAxios()
  }

  setAuthorization(token: string): void {
    this.headers[HTTP_HEADERS.authorization] = `Bearer ${token}`
    this.updateAxios()
  }

  setQueryParam(key: string, value: string | string[]): void {
    this.queryParams[key] = value
  }

  clearQueryParams(): void {
    this.queryParams = {}
  }
}
