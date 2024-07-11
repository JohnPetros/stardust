import { BaseError } from '../global/BaseError'

export class FetchUserUnlockedStarsIdsUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch User Unlocked Rocket Unexpected Error'
    this.message = 'Erro inesperado ao buscar estrelas'
  }
}
