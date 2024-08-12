import { BaseError } from '../global/BaseError'

export class InvalidRewardingPayloadError extends BaseError {
  constructor() {
    super()
    this.title = 'Invalid Rewarding Payload Error'
    this.message = 'Dados inválidos para o cálculo de recompensas'
  }
}
