import { type ZodArray, z, ZodError } from 'zod'

import type { ArrayValidation } from '../../../interfaces'
import { ZodValidationErrorFactory } from './ZodValidationErrorFactory'

export class ZodArrayValidation implements ArrayValidation {
  private data: unknown
  private key: string
  private zodArray: ZodArray<any>

  constructor(data: unknown, key?: string) {
    this.data = data
    this.key = key ?? 'Lista'
    this.zodArray = z.array(z.any())
  }

  string(message?: string) {
    this.zodArray = z.array(z.string(), {
      message: message ?? 'deve ser uma lista de textos',
    })

    return this
  }

  id(message?: string) {
    this.zodArray = z.array(z.string().uuid(), {
      message: message ?? "deve ser uma lista de id's",
    })

    return this
  }

  validate() {
    try {
      z.object({ [this.key]: this.zodArray }).parse({ [this.key]: this.data })
    } catch (error) {
      if (error instanceof ZodError) throw ZodValidationErrorFactory.produce(error)
    }
  }
}
