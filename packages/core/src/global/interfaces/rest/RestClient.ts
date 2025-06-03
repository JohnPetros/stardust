import type { RestResponse } from '../../responses'

export interface RestClient {
  get<Response>(route: string): Promise<RestResponse<Response>>
  post<Response>(route: string, request: unknown): Promise<RestResponse<Response>>
  setQueryParam(key: string, value: string): void
}
