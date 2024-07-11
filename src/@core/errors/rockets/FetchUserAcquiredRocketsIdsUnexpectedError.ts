import { BaseError } from '../global/BaseError'

export class FetchUserAcquiredRocketsIdsUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Get User Acquired Rockets Ids Id Unexpected Error'
    this.message = 'Erro inesperado ao buscar foquetes adquiridos'
  }
}
