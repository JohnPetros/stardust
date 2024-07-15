import { NumberValidation } from '@/@core/lib/validation'

type OrdinalNumberProps = {
  key: string
  value: number
}

export class OrdinalNumber {
  readonly key: string
  readonly value: number

  private constructor(props: OrdinalNumberProps) {
    this.key = props.key
    this.value = props.value
  }

  static create(key: string, value: number) {
    new NumberValidation(value, key).min(1).validate()

    return new OrdinalNumber({ key, value })
  }
}
