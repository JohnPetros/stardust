import { ValidationError } from '../../../../global/domain/errors'
import { DropZoneFaker } from './fakers'

describe('DropZone struct', () => {
  it('should not be created if it is not type of bank or slot', () => {
    expect(() => DropZoneFaker.fake({ type: 'invalid-type' })).toThrow(ValidationError)

    expect(() => DropZoneFaker.fake({ type: 'slot' })).toBeTruthy()
    expect(() => DropZoneFaker.fake({ type: 'bank' })).toBeTruthy()
  })

  it('should return whether is a bank or not', () => {
    let fakeDropZone = DropZoneFaker.fake({ type: 'bank' })
    expect(fakeDropZone.isBank.isTrue).toBeTruthy()

    fakeDropZone = DropZoneFaker.fake({ type: 'slot' })
    expect(fakeDropZone.isBank.isFalse).toBeTruthy()
  })

  it('should return whether is a slot or not', () => {
    let fakeDropZone = DropZoneFaker.fake({ type: 'slot' })
    expect(fakeDropZone.isSlot.isTrue).toBeTruthy()

    fakeDropZone = DropZoneFaker.fake({ type: 'bank' })
    expect(fakeDropZone.isSlot.isFalse).toBeTruthy()
  })
})
