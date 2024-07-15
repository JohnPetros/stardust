export class IdsCollection {
  readonly value: string[]

  private constructor(value: string[]) {
    this.value = value
  }

  static create(key: string, ids: string[]) {
    // if (ids.length) new ArrayValidation(ids, key).id().validate()

    return new IdsCollection(ids)
  }

  add(id: string) {
    this.value.push(id)
  }

  remove(id: string) {
    const ids = this.value.filter((currentId) => currentId !== id)
    return new IdsCollection(ids)
  }

  includes(id: string) {
    return this.value.includes(id)
  }
}
