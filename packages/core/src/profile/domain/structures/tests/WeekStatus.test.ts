import { ValidationError } from '../../../../global/domain/errors'
import { Datetime } from '../../../../global/libs'
import { WeekStatus } from '../WeekStatus'

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
