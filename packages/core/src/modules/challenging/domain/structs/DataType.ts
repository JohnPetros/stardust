import type { DataTypeName } from '#challenging/types'
import { AppError, ValidationError } from '#global/errors'
import {
  ArrayValidation,
  BooleanValidation,
  NumberValidation,
  StringValidation,
} from '#libs'

export class DataType<Value = unknown> {
  private constructor(
    readonly value: Value,
    readonly name: DataTypeName,
  ) {}

  static create(value: unknown): DataType {
    if (Array.isArray(value)) {
      return new DataType<Array<unknown>>(
        value.map((item) => DataType.create(item).value),
        'array',
      )
    }

    switch (typeof value) {
      case 'undefined':
        return new DataType<undefined>(value, 'undefined')
      case 'string':
        return new DataType<string>(value, 'string')
      case 'number':
        return new DataType<number>(value, 'number')
      case 'boolean':
        return new DataType<boolean>(value, 'boolean')
      default:
        return new DataType<undefined>(undefined, 'undefined')
    }
  }

  isString(): this is DataType<string> {
    return this.name === 'string'
  }

  isNumber(): this is DataType<number> {
    return this.name === 'number'
  }

  isBoolean(): this is DataType<boolean> {
    return this.name === 'boolean'
  }

  isArray(): this is DataType<Array<unknown>> {
    return this.name === 'array'
  }

  changeValue(value: unknown): DataType {
    switch (this.name) {
      case 'string':
        new StringValidation(value).validate()
        break
      case 'number':
        new NumberValidation(value).validate()
        break
      case 'boolean':
        new BooleanValidation(value).validate()
        break
    }

    return new DataType<Value>(value as Value, this.name)
  }

  changeArrayItem(item: unknown, index: number): DataType {
    if (!this.isArray()) this.throwArrayValueError()

    this.value[index] = item
    return new DataType(this.value, this.name)
  }

  addArrayItem(item: unknown): DataType {
    if (!this.isArray()) this.throwArrayValueError()

    this.value.push(item)
    return new DataType(this.value, this.name)
  }

  removeArrayItem(itemIndex: number): DataType {
    if (!this.isArray()) this.throwArrayValueError()

    this.value.splice(itemIndex, 1)
    return new DataType(this.value, this.name)
  }

  private throwArrayValueError(): never {
    throw new ValidationError([
      { name: 'Valor do datatype', messages: ['dever ser uma lista'] },
    ])
  }
}
