import { StringValidation } from '@/@core/lib/validation'

export class Image {
  readonly value: string

  constructor(value: string) {
    this.value = value
  }

  static create(value: string): Image {
    new StringValidation(value, 'Image').image().validate()

    return new Image(value)
  }

  get extension() {
    return this.value.slice(-2)
  }
}
