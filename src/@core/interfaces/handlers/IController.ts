import type { HttpResponse } from '@/@core/responses'
import type { IHttp } from './IHttp'

export interface IController {
  handle(http: IHttp): Promise<HttpResponse>
}
