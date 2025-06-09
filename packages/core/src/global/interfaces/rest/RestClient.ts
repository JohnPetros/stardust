import type { RestResponse } from '../../responses'

export interface RestClient {
  get<ResponseBody>(url: string): Promise<RestResponse<ResponseBody>>
  patch<ResponseBody>(url: string, body?: unknown): Promise<RestResponse<ResponseBody>>
  post<ResponseBody>(url: string, body?: unknown): Promise<RestResponse<ResponseBody>>
  put<ResponseBody>(url: string, body?: unknown): Promise<RestResponse<ResponseBody>>
  delete(url: string): Promise<RestResponse<void>>
  setBaseUrl(url: string): void
  setHeader(key: string, value: string): void
  setQueryParam(key: string, value: string): void
  clearQueryParams(): void
}
