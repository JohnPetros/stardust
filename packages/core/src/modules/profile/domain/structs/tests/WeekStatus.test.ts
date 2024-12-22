import { ValidationError } from '#global/errors'
import { WeekStatus } from '../profile/WeekStatus'
import { Datetime } from '@stardust/core/libs'

describe('WeekStatus struct', () => {
  it('should not be created if any status is invalid', () => {
    expect(() => {
      WeekStatus.create(['undone', 'done', 'bla'])
    }).toThrow(ValidationError)
  })

  it('should not be created if statuses count is less than 7', () => {
    expect(() => {
      WeekStatus.create(['undone', 'done', 'todo'])
    }).toThrow(ValidationError)
  })

  it('should get today status', () => {
    const statuses = ['undone', 'done', 'todo', 'todo', 'todo', 'todo', 'todo']

    const weekStatus = WeekStatus.create(statuses)

    expect(weekStatus.todayStatus).toBe(statuses[new Datetime().getTodayIndex()])
  })
})
