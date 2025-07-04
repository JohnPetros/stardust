import { type ZodEnum, ZodError, z, type ZodString, type ZodEffects } from 'zod'

import { ZodValidationErrorFactory } from './ZodValidationErrorFactory'
import type { StringValidation } from '../../../interfaces/libs/StringValidation'

export class ZodStringValidation implements StringValidation {
  private data: unknown
  private key: string
  private zodString: ZodString
  private zodEnum: ZodEnum<[string]> | undefined
  private zodEffects: ZodEffects<z.ZodString, string, string> | undefined

  constructor(data: unknown, key?: string, message?: string) {
    this.data = data
    this.key = key ?? ''
    this.zodString = z.string({
      invalid_type_error: 'deve ser um texto',
      required_error: message ?? 'é obrigatório',
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

    this.zodEffects = z
      .string()
      .refine(
        (val) => extensions.some((ext) => String(val).toLowerCase().endsWith(ext)),
        {
          message:
            message ?? `deve conter uma dessas extensões: ${extensions.join(', ')}`,
        },
      )

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

      if (this.zodEffects) {
        z.object({ [key]: this.zodEffects }).parse({ [key]: this.data })
      }

      z.object({ [key]: this.zodString }).parse({ [key]: this.data })
    } catch (error) {
      if (error instanceof ZodError) throw ZodValidationErrorFactory.produce(error)
    }
  }
}
