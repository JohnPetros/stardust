import { BaseError } from '../global/BaseError'

export class FetchShopRocketsListUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Shop Rockets List Unexpected Error'
    this.message = 'Erro inesperado ao buscar foguetes para mostrar na loja'
  }
}
