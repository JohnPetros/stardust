import type { ApiResponse } from '@stardust/core/responses'
import type { IHttp } from './IHttp'

export interface IController {
  handle(http: IHttp): Promise<ApiResponse>
}
