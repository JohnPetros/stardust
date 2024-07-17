import type { HttpResponse } from '@/@core/responses'

export interface IClient {
  get<Response>(route: string): Promise<HttpResponse<Response>>
}
