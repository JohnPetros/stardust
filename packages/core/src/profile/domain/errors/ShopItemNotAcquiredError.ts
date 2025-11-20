import { ConflictError } from '#global/domain/errors/ConflictError'

export class ShopItemNotAcquiredError extends ConflictError {
  constructor() {
    super('Item da loja não adquirido')
  }
}
