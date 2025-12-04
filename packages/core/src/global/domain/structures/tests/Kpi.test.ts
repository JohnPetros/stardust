import { Kpi } from '../Kpi'

describe('Kpi Structure', () => {
  it('should be created with a current value and a previous value', () => {
    const kpi = Kpi.create(100, 90)
    expect(kpi.currentValue.value).toBe(100)
    expect(kpi.previousValue.value).toBe(90)
  })

  it('should calculate the trend percentage', () => {
    let kpi = Kpi.create(100, 50)
    expect(kpi.trendPercentage.value).toBe(50)

    kpi = Kpi.create(125, 250)
    expect(kpi.trendPercentage.value).toBe(50)

    kpi = Kpi.create(250, 125)
    expect(kpi.trendPercentage.value).toBe(50)

    kpi = Kpi.create(200, 200)
    expect(kpi.trendPercentage.value).toBe(0)

    kpi = Kpi.create(110, 100)
    expect(kpi.trendPercentage.value).toBeCloseTo(90.91, 2)

    kpi = Kpi.create(120, 100)
    expect(kpi.trendPercentage.value).toBeCloseTo(83.33, 2)

    kpi = Kpi.create(125, 100)
    expect(kpi.trendPercentage.value).toBe(80)

    kpi = Kpi.create(150, 100)
    expect(kpi.trendPercentage.value).toBeCloseTo(66.67, 2)

    kpi = Kpi.create(300, 100)
    expect(kpi.trendPercentage.value).toBeCloseTo(33.33, 2)

    kpi = Kpi.create(400, 100)
    expect(kpi.trendPercentage.value).toBe(25)

    kpi = Kpi.create(90, 100)
    expect(kpi.trendPercentage.value).toBe(90)

    kpi = Kpi.create(80, 100)
    expect(kpi.trendPercentage.value).toBe(80)

    kpi = Kpi.create(75, 100)
    expect(kpi.trendPercentage.value).toBe(75)

    kpi = Kpi.create(33, 100)
    expect(kpi.trendPercentage.value).toBe(33)

    kpi = Kpi.create(25, 100)
    expect(kpi.trendPercentage.value).toBe(25)

    kpi = Kpi.create(10, 100)
    expect(kpi.trendPercentage.value).toBe(10)
  })

  it('should determine if it is trending up', () => {
    let kpi = Kpi.create(100, 90)
    expect(kpi.isTrendingUp.isTrue).toBeTruthy()

    kpi = Kpi.create(90, 100)
    expect(kpi.isTrendingUp.isFalse).toBeTruthy()
  })

  it('should determine if it is trending down', () => {
    let kpi = Kpi.create(100, 90)
    expect(kpi.isTrendingDown.isFalse).toBeTruthy()

    kpi = Kpi.create(90, 100)
    expect(kpi.isTrendingDown.isTrue).toBeTruthy()
  })
})
