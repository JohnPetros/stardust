import type { Integer } from '#global/structs'
import type { RewardingPayloadOrigin } from '#lesson/types'
import { Datetime } from '@stardust/core/libs'

export abstract class RewardingPayload {
  constructor(
    readonly origin: RewardingPayloadOrigin,
    readonly secondsCount: Integer,
  ) {}

  get time(): string {
    return new Datetime().convertSecondsToTime(this.secondsCount.value)
  }
}
