import type { IActionServer } from './IActionServer'

export interface IAction<Request, Response = void> {
  handle(actionServer: IActionServer<Request>): Promise<Response>
}
