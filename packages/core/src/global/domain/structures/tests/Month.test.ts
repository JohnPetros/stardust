import { Month } from '../Month'

describe('Month structure', () => {
  it('should be created with a valid date', () => {
    const month = Month.create()
    expect(month.value).toBeInstanceOf(Date)
  })

  it('should return the first day of the month', () => {
    const month = Month.create()
    expect(month.firstDay).toBeInstanceOf(Date)
    expect(month.firstDay.getDate()).toBe(1)
  })

  it('should return the last day of the month', () => {
    const month = Month.create()
    const currentDate = new Date()
    const expectedLastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate()

    expect(month.lastDay).toBeInstanceOf(Date)
    expect(month.lastDay.getDate()).toBe(expectedLastDay)
    expect(month.lastDay.getMonth()).toBe(currentDate.getMonth())
    expect(month.lastDay.getFullYear()).toBe(currentDate.getFullYear())
  })

  it('should return the previous month', () => {
    const month = Month.create()
    const currentDate = new Date()
    const previousMonthDate = new Date(currentDate)
    previousMonthDate.setMonth(currentDate.getMonth() - 1)

    expect(month.previousMonth).toBeInstanceOf(Month)
    expect(month.previousMonth.value.getMonth()).toBe(previousMonthDate.getMonth() - 1)
    expect(month.previousMonth.value.getFullYear()).toBe(previousMonthDate.getFullYear())
  })
})
