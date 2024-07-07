import { IHttp } from './IHttp'

export interface IController<Response> {
  handle(http: IHttp<Response>): Promise<Response>
}
