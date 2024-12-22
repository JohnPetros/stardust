import type { ApiResponse } from '@stardust/core/responses'
import type { HttpSchema, IHttp } from './IHttp'

export interface IController<ControllerHttpSchema extends HttpSchema = HttpSchema> {
  handle(http: IHttp<ControllerHttpSchema>): Promise<ApiResponse>
}
