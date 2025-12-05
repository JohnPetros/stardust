import { Kpi } from '../Kpi'

describe('Kpi Structure', () => {
  it('should be created with a value, current month value and previous month value', () => {
    const kpi = Kpi.create({ value: 100, currentMonthValue: 100, previousMonthValue: 90 })
    expect(kpi.value.value).toBe(100)
    expect(kpi.currentMonthValue.value).toBe(100)
    expect(kpi.previousMonthValue.value).toBe(90)
  })

  it('should calculate the trend percentage', () => {
    let kpi = Kpi.create({ value: 100, currentMonthValue: 100, previousMonthValue: 50 })
    expect(kpi.trendPercentage.value).toBe(50)

    kpi = Kpi.create({ value: 125, currentMonthValue: 125, previousMonthValue: 250 })
    expect(kpi.trendPercentage.value).toBe(50)

    kpi = Kpi.create({ value: 250, currentMonthValue: 250, previousMonthValue: 125 })
    expect(kpi.trendPercentage.value).toBe(50)

    kpi = Kpi.create({ value: 200, currentMonthValue: 200, previousMonthValue: 200 })
    expect(kpi.trendPercentage.value).toBe(0)

    kpi = Kpi.create({ value: 110, currentMonthValue: 110, previousMonthValue: 100 })
    expect(kpi.trendPercentage.value).toBeCloseTo(90.91, 2)

    kpi = Kpi.create({ value: 120, currentMonthValue: 120, previousMonthValue: 100 })
    expect(kpi.trendPercentage.value).toBeCloseTo(83.33, 2)

    kpi = Kpi.create({ value: 125, currentMonthValue: 125, previousMonthValue: 100 })
    expect(kpi.trendPercentage.value).toBe(80)

    kpi = Kpi.create({ value: 150, currentMonthValue: 150, previousMonthValue: 100 })
    expect(kpi.trendPercentage.value).toBeCloseTo(66.67, 2)

    kpi = Kpi.create({ value: 300, currentMonthValue: 300, previousMonthValue: 100 })
    expect(kpi.trendPercentage.value).toBeCloseTo(33.33, 2)

    kpi = Kpi.create({ value: 400, currentMonthValue: 400, previousMonthValue: 100 })
    expect(kpi.trendPercentage.value).toBe(25)

    kpi = Kpi.create({ value: 90, currentMonthValue: 90, previousMonthValue: 100 })
    expect(kpi.trendPercentage.value).toBe(90)

    kpi = Kpi.create({ value: 80, currentMonthValue: 80, previousMonthValue: 100 })
    expect(kpi.trendPercentage.value).toBe(80)

    kpi = Kpi.create({ value: 75, currentMonthValue: 75, previousMonthValue: 100 })
    expect(kpi.trendPercentage.value).toBe(75)

    kpi = Kpi.create({ value: 33, currentMonthValue: 33, previousMonthValue: 100 })
    expect(kpi.trendPercentage.value).toBe(33)

    kpi = Kpi.create({ value: 25, currentMonthValue: 25, previousMonthValue: 100 })
    expect(kpi.trendPercentage.value).toBe(25)

    kpi = Kpi.create({ value: 10, currentMonthValue: 10, previousMonthValue: 100 })
    expect(kpi.trendPercentage.value).toBe(10)
  })

  it('should determine if it is trending up', () => {
    let kpi = Kpi.create({ value: 100, currentMonthValue: 100, previousMonthValue: 90 })
    expect(kpi.isTrendingUp.isTrue).toBeTruthy()

    kpi = Kpi.create({ value: 90, currentMonthValue: 90, previousMonthValue: 100 })
    expect(kpi.isTrendingUp.isFalse).toBeTruthy()
  })

  it('should determine if it is trending down', () => {
    let kpi = Kpi.create({ value: 100, currentMonthValue: 100, previousMonthValue: 90 })
    expect(kpi.isTrendingDown.isFalse).toBeTruthy()

    kpi = Kpi.create({ value: 90, currentMonthValue: 90, previousMonthValue: 100 })
    expect(kpi.isTrendingDown.isTrue).toBeTruthy()
  })
})
