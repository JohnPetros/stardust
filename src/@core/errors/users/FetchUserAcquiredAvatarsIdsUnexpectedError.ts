import { BaseError } from '../global/BaseError'

export class FetchUserAcquiredAvatarsIdsUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch User Acquired Avatars Ids Unexpected Error'
    this.message = 'Erro inesperado ao buscar avatares adquiridos'
  }
}
