import { BaseEntity } from './BaseEntity'

export abstract class BuyableItem extends BaseEntity {
  private _price: number

  constructor(price: number, id?: string) {
    super(id)
    this._price = price
  }

  get price() {
    return this._price
  }
}
