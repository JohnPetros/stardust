import { InsigniasFaker } from '../fakers/InsigniasFaker'

describe('Insignia Entity', () => {
  it('should set isPurchasable as true when role is engineer', () => {
    const insignia = InsigniasFaker.fake({ role: 'engineer' })

    expect(insignia.isPurchasable.value).toBeTruthy()
  })

  it('should set isPurchasable as false when role is god', () => {
    const insignia = InsigniasFaker.fake({ role: 'god' })

    expect(insignia.isPurchasable.value).toBeFalsy()
  })
})
