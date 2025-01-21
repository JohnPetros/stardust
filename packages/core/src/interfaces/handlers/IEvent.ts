export interface IEvent<Payload = unknown> {
  readonly name: string
  readonly payload: Payload
}
