export abstract class Event<Payload = unknown> {
  constructor(
    readonly name: string,
    readonly payload: Payload,
  ) {}
}
