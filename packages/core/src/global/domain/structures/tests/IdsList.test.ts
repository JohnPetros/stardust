import { ValidationError } from '../../errors'
import { IdFaker } from '../fakers'
import { IdsList } from '../IdsList'

describe('Ids list structure', () => {
  it('should be created with an array of valid Id structures', () => {
    expect(() =>
      IdsList.create([IdFaker.fake().value, IdFaker.fake().value]),
    ).not.toThrow(ValidationError)
    expect(() =>
      IdsList.create([IdFaker.fake().value, IdFaker.fake().value, 'invalid id value']),
    ).toThrow(ValidationError)
  })

  it("should initialize with an empty array when no Id's are provided", () => {
    const list = IdsList.create()
    expect(list.ids).toEqual([])
  })

  it('should add an Id', () => {
    const list = IdsList.create()
    const id = IdFaker.fake()
    expect(list.add(id).ids).toEqual([id])
  })

  it('should remove an Id', () => {
    const id = IdFaker.fake()
    const idtoBeRemoved = IdFaker.fake()
    const list = IdsList.create([id.value, idtoBeRemoved.value])
    expect(list.remove(idtoBeRemoved).ids).toEqual([id])
  })

  it("should count all Id's in the list", () => {
    expect(IdsList.create([IdFaker.fake().value, IdFaker.fake().value]).count.value).toBe(
      2,
    )
    expect(IdsList.create([IdFaker.fake().value]).count.value).toBe(1)
    expect(IdsList.create().count.value).toBe(0)
  })
})
