import { StringValidation } from '../../libs'
import { Text } from './Text'

export class Image {
  static readonly DEFAULT_IMAGE_NAME = 'panda.jpg'
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

  get text(): Text {
    return Text.create(this.value)
  }
}
