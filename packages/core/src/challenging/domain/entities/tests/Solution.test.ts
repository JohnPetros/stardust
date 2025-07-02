import { SolutionsFaker } from '../fakers/SolutionsFaker'

describe('Solution Entity', () => {
  it('should increment upvotes count when upvoting', () => {
    const solution = SolutionsFaker.fake({ upvotesCount: 0 })
    expect(solution.upvotesCount.value).toBe(0)

    solution.upvote()

    expect(solution.upvotesCount.value).toBe(1)
  })

  it('should decrement upvotes count when removing upvote', () => {
    const solution = SolutionsFaker.fake({ upvotesCount: 1 })
    expect(solution.upvotesCount.value).toBe(1)

    solution.removeUpvote()

    expect(solution.upvotesCount.value).toBe(0)
  })

  it('should increment views count when viewing', () => {
    const solution = SolutionsFaker.fake({ viewsCount: 0 })
    expect(solution.viewsCount.value).toBe(0)
    expect(solution.isViewed.value).toBe(false)

    solution.view()

    expect(solution.viewsCount.value).toBe(1)
    expect(solution.isViewed.value).toBe(true)
  })
})
