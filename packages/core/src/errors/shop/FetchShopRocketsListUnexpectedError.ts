import { UnexpectedError } from '../global'

export class FetchShopRocketsListUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao buscar foguetes para mostrar na loja;')
  }
}
