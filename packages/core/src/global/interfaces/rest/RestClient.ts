import type { RestResponse } from '../../responses'

export interface RestClient {
  get<ResponseBody>(url: string): Promise<RestResponse<ResponseBody>>
  post<ResponseBody>(url: string, body?: unknown): Promise<RestResponse<ResponseBody>>
  postFormData<ResponseBody>(
    url: string,
    body: FormData,
  ): Promise<RestResponse<ResponseBody>>
  patch<ResponseBody>(url: string, body?: unknown): Promise<RestResponse<ResponseBody>>
  put<ResponseBody>(url: string, body?: unknown): Promise<RestResponse<ResponseBody>>
  delete(url: string): Promise<RestResponse>
  setBaseUrl(url: string): void
  setHeader(key: string, value: string): void
  setAuthorization(token: string): void
  setQueryParam(key: string, value: string | string[]): void
  clearQueryParams(): void
}
