import { ManualFunctions } from '../ManualFunctions'

describe('ManualFunctions', () => {
  it('should return an empty function list', () => {
    const functions = new ManualFunctions({} as never)

    expect(functions.getFunctions({} as never)).toEqual([])
  })
})
