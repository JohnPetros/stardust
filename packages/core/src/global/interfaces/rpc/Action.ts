import type { Call } from './Call'

export interface Action<Request = void, Response = void> {
  handle(call: Call<Request>): Promise<Response>
}
