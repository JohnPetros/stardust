import { ShuffledList } from '../ShuffledList'

describe('Shuffled list structure', () => {
  it('should be created as a list containing all elements from the original list, in a different order', () => {
    expect(ShuffledList.create([1, 2, 3])).not.toEqual([1, 2, 3])
  })
})
