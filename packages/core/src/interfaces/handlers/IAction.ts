import type { IActionServer } from './IActionServer'

export interface IAction<Request = void, Response = void> {
  handle(actionServer: IActionServer<Request>): Promise<Response>
}
