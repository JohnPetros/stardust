import { CountInvalidValueError } from '@/@core/errors/validation'
import { BaseStruct } from '../abstracts'

type CountProps = {
  key: string
  value: number
}

export class Count extends BaseStruct<CountProps> {
  readonly key: string
  readonly value: number

  private constructor(props: CountProps) {
    super(props)
    this.key = props.key
    this.value = props.value
  }

  static create({ key, value }: CountProps) {
    if (value < 0) throw new CountInvalidValueError({ key, value })

    return new Count({ key, value })
  }
}
