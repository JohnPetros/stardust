import { BaseError } from '../global/BaseError'

export class FetchUserAcquiredRocketsIdsUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch User Acquired Rockets Ids Unexpected Error'
    this.message = 'Erro inesperado ao buscar foguetes adquiridos'
  }
}
