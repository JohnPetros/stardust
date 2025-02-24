export type EventPayload<Event extends abstract new (...args: any) => any> =
  ConstructorParameters<Event>['0']
