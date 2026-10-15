export type OutboxEvent = {
  id: string
  name: string
  payload: unknown
  attempts: number
}
