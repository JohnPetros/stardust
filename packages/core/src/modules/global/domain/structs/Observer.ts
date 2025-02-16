export class Observer {
  readonly callback: VoidFunction

  constructor(callback: VoidFunction) {
    this.callback = callback
  }
}
