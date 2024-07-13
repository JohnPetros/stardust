import { StringValidation } from '@/@core/lib/validation'
import { BaseStruct } from '../abstracts'

type ImageProps = {
  value: string
}

export class Image extends BaseStruct<ImageProps> {
  readonly value: string

  constructor(props: ImageProps) {
    super(props)
    this.value = props.value
  }

  static create(value: string): Image {
    new StringValidation(value, 'Image').image().validate()

    return new Image({ value })
  }

  get extension() {
    return this.value.slice(-2)
  }
}
