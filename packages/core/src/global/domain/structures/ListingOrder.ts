import { StringValidation } from '#global/libs/index'
import { Logical } from './Logical'

type ListingOrderValue = 'ascending' | 'descending' | 'any'

export class ListingOrder {
  private constructor(readonly value: ListingOrderValue) {}

  static create(value?: string) {
    if (!value) return new ListingOrder('ascending')

    if (!ListingOrder.isListingOrderValue(value)) throw new Error()

    return new ListingOrder(value)
  }

  private static isListingOrderValue(value: string): value is ListingOrderValue {
    new StringValidation(value).oneOf(['ascending', 'descending', 'any'])
    return true
  }

  get isAscending(): Logical {
    return Logical.create(this.value === 'ascending')
  }

  get isDescending(): Logical {
    return Logical.create(this.value === 'descending')
  }

  get isAny(): Logical {
    return Logical.create(this.value === 'any')
  }
}
