import { StringValidation } from '#global/libs/index'

type ListOrderValue = 'ascending' | 'descending'

export class ListOrder {
  private constructor(readonly value: ListOrderValue) {}

  static create(value: string) {
    if (!ListOrder.isListOrderValue(value)) throw new Error()

    return new ListOrder(value)
  }

  private static isListOrderValue(value: string): value is ListOrderValue {
    new StringValidation(value).oneOf(['ascending', 'descending'])
    return true
  }
}
