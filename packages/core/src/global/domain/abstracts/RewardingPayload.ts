import { Datetime } from '../../libs'
import type { Integer } from '../structures'
import type { RewardingPayloadOrigin } from '../types'

export abstract class RewardingPayload {
  constructor(
    readonly origin: RewardingPayloadOrigin,
    readonly secondsCount: Integer,
  ) {}

  get time(): string {
    return new Datetime().convertSecondsToTime(this.secondsCount.value)
  }
}
