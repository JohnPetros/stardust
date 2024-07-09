import { HttpResponse } from '@/@core/responses'
import { IHttp } from './IHttp'

export interface IController {
  handle(http: IHttp): Promise<HttpResponse>
}
