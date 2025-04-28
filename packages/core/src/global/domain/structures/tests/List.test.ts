import { List } from '../List'

describe('List structure', () => {
  it('should add an item', () => {
    const list = List.create([1, 2, 3])

    expect(list.add(4).items).toEqual([1, 2, 3, 4])
  })

  it('should remove an item', () => {
    const list = List.create([1, 2, 3])

    expect(list.remove(2).items).toEqual([1, 3])
  })

  it('should swap items', () => {
    let list = List.create([1, 2, 3, 4])
    expect(list.swap(2, 3).items).toEqual([1, 3, 2, 4])

    list = List.create([1, 2, 3, 4])
    expect(list.swap(3, 1).items).toEqual([3, 2, 1, 4])

    list = List.create([1, 2, 3, 4])
    expect(list.swap(1, 4).items).toEqual([4, 2, 3, 1])

    list = List.create([1, 2, 3, 4])
    expect(list.swap(4, 1).items).toEqual([4, 2, 3, 1])
  })

  it('should verify if it is equal to another list', () => {
    let list = List.create([1, 2, 3, 4])
    let otherList = List.create([1, 2, 3, 4])

    expect(list.isEqualTo(otherList).isTrue).toBeTruthy()

    list = List.create([1, 2, 3, 4])
    otherList = List.create([1, 2, 3, 5])

    expect(list.isEqualTo(otherList).isFalse).toBeTruthy()

    list = List.create([1, 2, 3, 4])
    otherList = List.create([1, 2])

    expect(list.isEqualTo(otherList).isFalse).toBeTruthy()

    list = List.create([1, 2, 3, 4])
    otherList = List.create([1, 2, 3, 4, 5])

    expect(list.isEqualTo(otherList).isFalse).toBeTruthy()
  })

  it('should verify if include other list', () => {
    let list = List.create([1, 2, 3, 4])
    let otherList = List.create([2, 3])

    expect(list.includesList(otherList).isTrue).toBeTruthy()

    list = List.create([1, 2, 3, 4])
    otherList = List.create([5, 6])

    expect(list.includesList(otherList).isFalse).toBeTruthy()

    list = List.create([1, 2, 3, 4])
    otherList = List.create([1, 2, 5])

    expect(list.includesList(otherList).isFalse).toBeTruthy()

    list = List.create([1, 2, 3, 4])
    otherList = List.create([4, 3, 2, 1])

    expect(list.includesList(otherList).isTrue).toBeTruthy()
  })

  it('should get an item by index, returning a falllback value if it is not found', () => {
    const list = List.create([1, 2, 3, 4])

    expect(list.getByIndex(0, 'fallback value')).toBe(1)
    expect(list.getByIndex(1, 'fallback value')).toBe(2)
    expect(list.getByIndex(2, 'fallback value')).toBe(3)
    expect(list.getByIndex(3, 'fallback value')).toBe(4)
    expect(list.getByIndex(4, 'fallback value')).toBe('fallback value')
  })

  it('should determine if the list is empty', () => {
    expect(List.create([1, 2, 3, 4]).isEmpty().value).toBeFalsy()
    expect(List.create([]).isEmpty().value).toBeTruthy()
  })

  it('should become empty', () => {
    let list = List.create([1, 2, 3, 4])
    expect(list.hasItems.value).toBeTruthy()

    list = list.becomeEmpty()
    expect(list.hasItems.value).toBeFalsy()
  })

  it('should return true if the list includes at least one item from the given array', () => {
    expect(List.create([1, 2, 3, 4]).includesSome([4, 5, 6, 7]).value).toBeTruthy()
    expect(List.create([1, 2, 3, 4]).includesSome([5, 6, 7, 8]).value).toBeFalsy()
  })

  it('should return true if all items in the list are equal to a given value', () => {
    expect(List.create([3, 3, 3]).hasAllEqualTo(3).value).toBeTruthy()
    expect(List.create([3, 2, 3]).hasAllEqualTo(3).value).toBeFalsy()
  })

  it('should return the length of the list', () => {
    const list = List.create([1, 2, 3, 4])

    expect(list.lengthTruthy).toBe(4)
  })

  it('should return the length of the list considering only the truthy values', () => {
    const list = List.create([1, true, '', 0])
    expect(list.lengthTruthy).toBe(2)
  })

  it('should return true if the ist has items', () => {
    expect(List.create([1, true, '', 0]).hasItems.value).toBeTruthy()
    expect(List.create([]).hasItems.value).toBeFalsy()
  })

})
