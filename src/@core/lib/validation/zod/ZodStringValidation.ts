import { type ZodEnum, ZodError, z, type ZodString } from 'zod'

import { ValidationError } from '@/@core/errors/lib'
import type { IStringValidation } from '@/@core/interfaces/lib'

export class ZodStringValidation implements IStringValidation {
  private data: unknown
  private key: string
  private zodString: ZodString
  private zodEnum: ZodEnum<[string]> | undefined

  constructor(data: unknown, key?: string, message?: string) {
    this.data = data
    this.key = key ?? ''
    this.zodString = z.string({ required_error: message })
  }

  min(minValue: number, message?: string) {
    this.zodString = this.zodString.min(
      minValue,
      message ?? `${this.key} value must have at least ${minValue} characters`
    )
    return this
  }

  id(message?: string) {
    this.zodString = this.zodString.uuid(
      message ?? `${this.key} value must be a valid id`
    )

    return this
  }

  email(message?: string) {
    this.zodString = this.zodString.email(
      message ?? 'E-mail value must be a valid format'
    )
    return this
  }

  oneOf(strings: string[], message?: string) {
    this.zodEnum = z.enum(strings as [string], {
      message:
        message ??
        `${this.key} value must be one of the following values: ${strings.slice(3).join(', ')}...`,
    })

    return this
  }

  validate() {
    try {
      if (this.zodEnum) {
        this.zodEnum.parse(this.data)
      }

      console.log(this.data)

      this.zodString.parse(this.data)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(error.flatten().formErrors)
      }
    }
  }
}
