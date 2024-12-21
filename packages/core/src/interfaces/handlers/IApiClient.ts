import type { HttpResponse } from '@/@core/responses'

export interface IApiClient {
  get<Response>(route: string): Promise<HttpResponse<Response>>
  post<Response>(route: string, request: unknown): Promise<HttpResponse<Response>>
}
