import { BaseError } from '../global/BaseError'

export class FetchUserUnlockedStarsIdUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch User Unlocked Rocket Unexpected Error'
    this.message = 'Erro inesperado ao buscar estrelas'
  }
}
