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
      return new DataType<Array<unknown>>(value, 'undefined')
    }

    switch (typeof value) {
      case 'undefined':
        return new DataType<undefined>(value, 'undefined')
      case 'string':
        return new DataType<string>(value, 'string')
      case 'number':
        return new DataType<number>(value, 'number')
      case 'boolean':
        return value === true
          ? new DataType<true>(value, 'true')
          : new DataType<false>(value, 'false')
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

  isTrue(): this is DataType<true> {
    return this.name === 'true'
  }

  isFalse(): this is DataType<false> {
    return this.name === 'false'
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
      case 'true':
        new BooleanValidation(value).true().validate()
        break
      case 'false':
        new BooleanValidation(value).false().validate()
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

  private throwArrayValueError(): never {
    throw new ValidationError([
      { name: 'Valor do datatype', messages: ['dever ser uma lista'] },
    ])
  }
}
