import { type ZodArray, z, ZodError } from 'zod'

import type { IArrayValidation } from '#interfaces'
import { ValidationError } from '#global/errors'

export class ZodArrayValidation implements IArrayValidation {
  private data: unknown
  private key: string
  private zodArray: ZodArray<any>

  constructor(data: unknown, key: string) {
    this.data = data
    this.key = key
    this.zodArray = z.array(z.any())
  }

  string(message?: string) {
    this.zodArray = z.array(z.string(), {
      message: message ?? `${this.key} must be a array of strings`,
    })

    return this
  }

  id(message?: string) {
    this.zodArray = z.array(z.string().uuid(), {
      message: message ?? `${this.key} must be a array of ids`,
    })

    return this
  }

  validate() {
    try {
      this.zodArray.parse(this.data)
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.flatten().fieldErrors

        throw new ValidationError(
          Object.entries(fieldErrors).map(([field, messages]) => ({
            name: field,
            messages: messages ?? [],
          })),
        )
      }
    }
  }
}
