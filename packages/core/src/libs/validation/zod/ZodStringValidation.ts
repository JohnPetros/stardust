import { type ZodEnum, ZodError, z, type ZodString } from 'zod'

import type { IStringValidation } from '#interfaces'
import { ZodValidationErrorFactory } from './ZodValidationErrorFactory'

export class ZodStringValidation implements IStringValidation {
  private data: unknown
  private key: string
  private zodString: ZodString
  private zodEnum: ZodEnum<[string]> | undefined

  constructor(data: unknown, key?: string, message?: string) {
    this.data = data
    this.key = key ?? ''
    this.zodString = z.string({
      required_error: message ?? 'deve ser um texto',
    })
  }

  min(minValue: number, message?: string) {
    this.zodString = this.zodString.min(
      minValue,
      message ?? `deve ter pelo menos ${minValue} caracteres`,
    )
    return this
  }

  id(message?: string) {
    this.zodString = this.zodString.uuid(message ?? 'deve ser um id válido')

    return this
  }

  email(message?: string) {
    this.zodString = this.zodString.email(message ?? 'deve ser um e-mail válido')
    return this
  }

  url(message?: string) {
    this.zodString = this.zodString.url(message ?? 'deve ser uma url válida')
    return this
  }

  image(message?: string) {
    const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg']

    this.zodEnum = z.enum(extensions as [string], {
      message: message ?? `deve conter uma dessas extensões: ${extensions.join(', ')}`,
    })

    this.data = String(this.data).slice(-4)

    return this
  }

  oneOf(strings: string[], message?: string) {
    this.zodEnum = z.enum(strings as [string], {
      message:
        message ?? `deve ser apena um dos valores: ${strings.slice(3).join(', ')}...`,
    })

    return this
  }

  validate() {
    try {
      const key = this.key ?? 'erro'
      if (this.zodEnum) {
        z.object({ [key]: this.zodEnum }).parse({ [key]: this.data })
      }

      z.object({ [key]: this.zodString }).parse({ [key]: this.data })
    } catch (error) {
      if (error instanceof ZodError) throw ZodValidationErrorFactory.produce(error)
    }
  }
}
