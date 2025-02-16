import type { ApiResponse } from '#responses'

export interface IApiClient {
  get<Response>(route: string): Promise<ApiResponse<Response>>
  post<Response>(route: string, request: unknown): Promise<ApiResponse<Response>>
  setQueryParam(key: string, value: string): void
}
