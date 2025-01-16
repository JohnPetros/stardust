import { AppError } from '#global/errors'
import { Logical } from './Logical'

export class Backup<State> {
  readonly states: State[]

  private constructor(states: State[]) {
    this.states = states
  }

  static create<State>(states: State[] = []) {
    return new Backup<State>(states)
  }

  get lastState() {
    if (this.isEmpty) {
      throw new AppError('Backup is empty', 'Backup error')
    }

    const lastState = this.states.pop()
    return lastState as State
  }

  get isEmpty() {
    return Logical.create(this.states.length === 0)
  }

  save(state: State) {
    this.states.push(state)
    return new Backup(this.states)
  }

  undo() {
    this.states.pop()
    return new Backup(this.states)
  }
}
