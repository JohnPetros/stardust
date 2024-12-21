import type { ApiResponse } from '@stardust/core/responses'

export interface IApiClient {
  get<Response>(route: string): Promise<ApiResponse<Response>>
  post<Response>(route: string, request: unknown): Promise<ApiResponse<Response>>
}
