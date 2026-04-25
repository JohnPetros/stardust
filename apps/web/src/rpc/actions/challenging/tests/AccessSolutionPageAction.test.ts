import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { NotSolutionAuthorError } from '@stardust/core/challenging/errors'
import {
  ChallengesFaker,
  SolutionsFaker,
} from '@stardust/core/challenging/entities/fakers'
import type { Call } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { Slug } from '@stardust/core/global/structures'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { AccessSolutionPageAction } from '../AccessSolutionPageAction'

describe('Access Solution Page Action', () => {
  let call: Mock<Call<{ challengeSlug: string; solutionSlug?: string }>>
  let challengingService: Mock<ChallengingService>

  const challengeSlug = 'binary-search'
  const solutionSlug = 'binary-search-solution'

  beforeEach(() => {
    call = mock<Call<{ challengeSlug: string; solutionSlug?: string }>>()
    challengingService = mock<ChallengingService>()
  })

  it('should return challenge id and null solution when no solution slug is provided', async () => {
    const userDto = UsersFaker.fakeDto()
    const challengeDto = ChallengesFaker.fakeDto({ slug: challengeSlug })

    call.getRequest.mockReturnValue({ challengeSlug })
    call.getUser.mockResolvedValue(userDto)
    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )

    const action = AccessSolutionPageAction(challengingService)
    const response = await action.handle(call)

    expect(challengingService.fetchChallengeBySlug).toHaveBeenCalledWith(
      Slug.create(challengeSlug),
    )
    expect(challengingService.fetchSolutionBySlug).not.toHaveBeenCalled()
    expect(response).toEqual({
      challengeId: challengeDto.id,
      solution: null,
    })
  })

  it('should return solution when user is the solution author', async () => {
    const userDto = UsersFaker.fakeDto()
    const challengeDto = ChallengesFaker.fakeDto({ slug: challengeSlug })
    const solutionDto = SolutionsFaker.fakeDto({
      slug: solutionSlug,
      author: {
        id: userDto.id as string,
        entity: SolutionsFaker.fakeDto().author.entity,
      },
    })

    call.getRequest.mockReturnValue({ challengeSlug, solutionSlug })
    call.getUser.mockResolvedValue(userDto)
    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchSolutionBySlug.mockResolvedValue(
      new RestResponse({ body: solutionDto }),
    )

    const action = AccessSolutionPageAction(challengingService)
    const response = await action.handle(call)

    expect(challengingService.fetchSolutionBySlug).toHaveBeenCalledWith(
      Slug.create(solutionSlug),
    )
    expect(response).toEqual({
      challengeId: challengeDto.id,
      solution: solutionDto,
    })
  })

  it('should throw NotSolutionAuthorError when user is not the solution author', async () => {
    const userDto = UsersFaker.fakeDto()
    const challengeDto = ChallengesFaker.fakeDto({ slug: challengeSlug })
    const solutionDto = SolutionsFaker.fakeDto({
      slug: solutionSlug,
      author: {
        id: UsersFaker.fakeDto().id as string,
        entity: SolutionsFaker.fakeDto().author.entity,
      },
    })

    call.getRequest.mockReturnValue({ challengeSlug, solutionSlug })
    call.getUser.mockResolvedValue(userDto)
    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchSolutionBySlug.mockResolvedValue(
      new RestResponse({ body: solutionDto }),
    )

    const action = AccessSolutionPageAction(challengingService)

    await expect(action.handle(call)).rejects.toBeInstanceOf(NotSolutionAuthorError)
  })

  it('should throw when challenge lookup fails', async () => {
    const userDto = UsersFaker.fakeDto()

    call.getRequest.mockReturnValue({ challengeSlug, solutionSlug })
    call.getUser.mockResolvedValue(userDto)
    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ statusCode: 404, errorMessage: 'Challenge not found' }),
    )

    const action = AccessSolutionPageAction(challengingService)

    await expect(action.handle(call)).rejects.toThrow('Challenge not found')
    expect(challengingService.fetchSolutionBySlug).not.toHaveBeenCalled()
  })

  it('should throw when solution lookup fails', async () => {
    const userDto = UsersFaker.fakeDto()
    const challengeDto = ChallengesFaker.fakeDto({ slug: challengeSlug })

    call.getRequest.mockReturnValue({ challengeSlug, solutionSlug })
    call.getUser.mockResolvedValue(userDto)
    challengingService.fetchChallengeBySlug.mockResolvedValue(
      new RestResponse({ body: challengeDto }),
    )
    challengingService.fetchSolutionBySlug.mockResolvedValue(
      new RestResponse({ statusCode: 404, errorMessage: 'Solution not found' }),
    )

    const action = AccessSolutionPageAction(challengingService)

    await expect(action.handle(call)).rejects.toThrow('Solution not found')
  })
})
