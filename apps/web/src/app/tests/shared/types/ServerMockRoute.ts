import type { ServerMockMethod } from './ServerMockMethod'

export type ServerMockRoute = {
  method: ServerMockMethod
  path: string
  query?: Record<string, string>
  status?: number
  delayInMs?: number
  body?: unknown
  headers?: Record<string, string>
}
