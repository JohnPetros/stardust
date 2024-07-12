import { ArrayValidation } from '@/@core/lib/validation'
import { BaseStruct } from '../abstracts'

type IdsCollectionProps = {
  value: string[]
}

export class IdsCollection extends BaseStruct<IdsCollectionProps> {
  readonly value: string[]

  private constructor(props: IdsCollectionProps) {
    super(props)
    this.value = props.value
  }

  static create(key: string, ids: string[]) {
    new ArrayValidation(ids, key).id().validate()

    return new IdsCollection({ value: ids })
  }

  add(id: string) {
    this.value.push(id)
  }

  remove(id: string) {
    const ids = this.value.filter((currentId) => currentId !== id)
    return new IdsCollection({ value: ids })
  }

  includes(id: string) {
    return this.value.includes(id)
  }
}
