import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { SolutionsFaker } from '@stardust/core/challenging/entities/fakers'
import type { Call } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { Slug } from '@stardust/core/global/structures'

import { ViewSolutionAction } from '../ViewSolutionAction'

describe('View Solution Action', () => {
  let call: Mock<Call<{ solutionSlug: string }>>
  let challengingService: Mock<ChallengingService>

  const solutionSlug = 'binary-search-solution'

  beforeEach(() => {
    call = mock<Call<{ solutionSlug: string }>>()
    challengingService = mock<ChallengingService>()

    call.getRequest.mockReturnValue({ solutionSlug })
  })

  it('should return the solution for a valid slug', async () => {
    const solutionDto = SolutionsFaker.fakeDto({ slug: solutionSlug })

    challengingService.viewSolution.mockResolvedValue(
      new RestResponse({ body: solutionDto }),
    )

    const action = ViewSolutionAction(challengingService)
    const response = await action.handle(call)

    expect(challengingService.viewSolution).toHaveBeenCalledWith(
      Slug.create(solutionSlug),
    )
    expect(response).toEqual({ solution: solutionDto })
  })

  it('should throw when solution cannot be viewed', async () => {
    challengingService.viewSolution.mockResolvedValue(
      new RestResponse({ statusCode: 404, errorMessage: 'Solution not found' }),
    )

    const action = ViewSolutionAction(challengingService)

    await expect(action.handle(call)).rejects.toThrow('Solution not found')
  })
})
