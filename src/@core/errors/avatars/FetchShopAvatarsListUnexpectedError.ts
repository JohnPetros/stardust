import { BaseError } from '../global/BaseError'

export class FetchShopAvatarsListUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Shop Avatars List Unexpected Error'
    this.message = 'Erro inesperado ao buscar avatares para mostrar na loja'
  }
}
