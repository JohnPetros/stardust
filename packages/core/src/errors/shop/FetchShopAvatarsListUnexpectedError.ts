import { UnexpectedError } from '../global'

export class FetchShopAvatarsListUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao buscar avatares para mostrar na loja.')
  }
}
