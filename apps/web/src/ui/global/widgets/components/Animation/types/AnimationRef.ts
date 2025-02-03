import type { AnimationSpeed } from './AnimationSpeed'

export type AnimationRef = {
  stopAt(second: number): void
  setSpeed(speed: AnimationSpeed): void
  restart(): void
}
