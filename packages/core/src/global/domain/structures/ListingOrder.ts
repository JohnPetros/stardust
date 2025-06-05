import { StringValidation } from '#global/libs/index'

type ListingOrderValue = 'ascending' | 'descending'

export class ListingOrder {
  private constructor(readonly value: ListingOrderValue) {}

  static create(value?: string) {
    if (!value) return new ListingOrder('ascending')

    if (!ListingOrder.isListingOrderValue(value)) throw new Error()

    return new ListingOrder(value)
  }

  private static isListingOrderValue(value: string): value is ListingOrderValue {
    new StringValidation(value).oneOf(['ascending', 'descending'])
    return true
  }
}
