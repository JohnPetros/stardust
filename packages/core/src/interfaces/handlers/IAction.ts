import type { IActionServer } from './IActionServer'

export interface IAction<Request, Response> {
  handle(actionServer: IActionServer<Request>): Promise<Response>
}
