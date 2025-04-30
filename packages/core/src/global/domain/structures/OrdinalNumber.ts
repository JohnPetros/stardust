import { NumberValidation } from '../../libs'
import { Integer } from './Integer'

type OrdinalNumberProps = {
  key: string
  number: Integer
}

export class OrdinalNumber {
  readonly key: string
  readonly number: Integer

  private constructor(props: OrdinalNumberProps) {
    this.key = props.key
    this.number = props.number
  }

  static create(number: number, key = 'Número ordinal') {
    new NumberValidation(number, key).min(1).validate()

    return new OrdinalNumber({ key, number: Integer.create(number) })
  }

  increment() {
    return new OrdinalNumber({
      key: this.key,
      number: this.number.increment(),
    })
  }

  dencrement() {
    return new OrdinalNumber({
      key: this.key,
      number: this.number.dencrement(),
    })
  }
}
