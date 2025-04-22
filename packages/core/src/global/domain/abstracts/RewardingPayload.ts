import type { Integer } from '../structs'
import type { RewardingPayloadOrigin } from '../../../lesson/domain/types'
import { Datetime } from '../../libs'

export abstract class RewardingPayload {
  constructor(
    readonly origin: RewardingPayloadOrigin,
    readonly secondsCount: Integer,
  ) {}

  get time(): string {
    return new Datetime().convertSecondsToTime(this.secondsCount.value)
  }
}
