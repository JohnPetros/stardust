import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Slug } from '@stardust/core/global/structures'
import { Solution } from '@stardust/core/challenging/entities'
import {
  ChallengesFaker,
  SolutionsFaker,
} from '@stardust/core/challenging/entities/fakers'
import type { SolutionDto, ChallengeDto } from '@stardust/core/challenging/entities/dtos'

import { ROUTES } from '@/constants'
import { AccessSolutionPageController } from '../AccessSolutionPageController'

describe('Access Solution Page Controller', () => {
  let http: Mock<Http>
  let service: Mock<ChallengingService>
  let controller: Controller

  const solutionSlug = 'test-solution-slug'
  const challengeSlug = 'test-challenge-slug'

  const mockSolutionData = SolutionsFaker.fakeDto({ slug: solutionSlug })
  const mockChallengeData = ChallengesFaker.fakeDto({ slug: challengeSlug })

  beforeEach(() => {
    http = mock()
    service = mock<ChallengingService>()

    http.getRouteParams.mockImplementation()
    http.redirect.mockImplementation()
    service.fetchSolutionBySlug.mockImplementation()
    service.fetchChallengeBySolutionId.mockImplementation()

    controller = AccessSolutionPageController(service)
  })

  it('should extract solution slug from route parameters', async () => {
    http.getRouteParams.mockReturnValue({ solutionSlug })
    service.fetchSolutionBySlug.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: mockSolutionData }),
    )
    service.fetchChallengeBySolutionId.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: mockChallengeData }),
    )

    await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalled()
    expect(service.fetchSolutionBySlug).toHaveBeenCalledWith(Slug.create(solutionSlug))
  })

  it('should fetch solution by slug', async () => {
    http.getRouteParams.mockReturnValue({ solutionSlug })
    service.fetchSolutionBySlug.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: mockSolutionData }),
    )
    service.fetchChallengeBySolutionId.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: mockChallengeData }),
    )

    await controller.handle(http)

    expect(service.fetchSolutionBySlug).toHaveBeenCalledWith(Slug.create(solutionSlug))
  })

  it('should fetch challenge by solution id after getting solution', async () => {
    http.getRouteParams.mockReturnValue({ solutionSlug })
    service.fetchSolutionBySlug.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: mockSolutionData }),
    )
    service.fetchChallengeBySolutionId.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: mockChallengeData }),
    )

    await controller.handle(http)

    const expectedSolution = Solution.create(mockSolutionData)
    expect(service.fetchChallengeBySolutionId).toHaveBeenCalledWith(expectedSolution.id)
  })

  it('should throw error when solution is not found', async () => {
    http.getRouteParams.mockReturnValue({ solutionSlug })
    const errorResponse = new RestResponse<SolutionDto>({
      statusCode: HTTP_STATUS_CODE.notFound,
      errorMessage: 'Solution not found',
    })
    service.fetchSolutionBySlug.mockResolvedValue(errorResponse)

    await expect(controller.handle(http)).rejects.toThrow()
    expect(service.fetchChallengeBySolutionId).not.toHaveBeenCalled()
    expect(http.redirect).not.toHaveBeenCalled()
  })

  it('should throw error when challenge is not found after solution is found', async () => {
    http.getRouteParams.mockReturnValue({ solutionSlug })
    service.fetchSolutionBySlug.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: mockSolutionData }),
    )
    const errorResponse = new RestResponse<ChallengeDto>({
      statusCode: HTTP_STATUS_CODE.notFound,
      errorMessage: 'Challenge not found',
    })
    service.fetchChallengeBySolutionId.mockResolvedValue(errorResponse)

    await expect(controller.handle(http)).rejects.toThrow()
    expect(http.redirect).not.toHaveBeenCalled()
  })

  it('should handle server errors when fetching solution', async () => {
    http.getRouteParams.mockReturnValue({ solutionSlug })
    const errorResponse = new RestResponse<SolutionDto>({
      statusCode: HTTP_STATUS_CODE.serverError,
      errorMessage: 'Internal server error',
    })
    service.fetchSolutionBySlug.mockResolvedValue(errorResponse)

    await expect(controller.handle(http)).rejects.toThrow()
    expect(service.fetchChallengeBySolutionId).not.toHaveBeenCalled()
  })

  it('should handle server errors when fetching challenge', async () => {
    http.getRouteParams.mockReturnValue({ solutionSlug })
    service.fetchSolutionBySlug.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: mockSolutionData }),
    )
    const errorResponse = new RestResponse<ChallengeDto>({
      statusCode: HTTP_STATUS_CODE.serverError,
      errorMessage: 'Internal server error',
    })
    service.fetchChallengeBySolutionId.mockResolvedValue(errorResponse)

    await expect(controller.handle(http)).rejects.toThrow()
    expect(http.redirect).not.toHaveBeenCalled()
  })
})
