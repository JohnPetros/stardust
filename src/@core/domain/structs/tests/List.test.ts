import { List } from '../List'

describe('List struct', () => {
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

  it('should verify if is equal to other list', () => {
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

  it('should return the length', () => {
    const list = List.create([1, 2, 3, 4])

    expect(list.lengthTruthy).toBe(4)
  })

  it('should return the length only considering the truthy items', () => {
    const list = List.create(['1', '2', '', '4', ''])

    expect(list.lengthTruthy).toBe(3)
  })
})
