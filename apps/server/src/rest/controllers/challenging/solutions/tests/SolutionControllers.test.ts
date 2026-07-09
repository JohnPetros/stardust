import { mock } from 'ts-jest-mocker'

import { SolutionsFaker } from '@stardust/core/challenging/entities/fakers'
import type {
  ChallengesRepository,
  SolutionsRepository,
} from '@stardust/core/challenging/interfaces'
import {
  DeleteSolutionUseCase,
  EditSolutionUseCase,
  GetSolutionUseCase,
  ListSolutionsUseCase,
  PostSolutionUseCase,
  UpvoteSolutionUseCase,
  ViewSolutionUseCase,
} from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import { PaginationResponse } from '@stardust/core/global/responses'
import type { RestResponse } from '@stardust/core/global/responses'

import * as controllers from '../index'

describe('Solution controllers', () => {
  it('should export every controller from the barrel file', () => {
    expect(controllers.DeleteSolutionController).toBeDefined()
    expect(controllers.EditSolutionController).toBeDefined()
    expect(controllers.FetchSolutionController).toBeDefined()
    expect(controllers.FetchSolutionsListController).toBeDefined()
    expect(controllers.PostSolutionController).toBeDefined()
    expect(controllers.UpvoteSolutionController).toBeDefined()
    expect(controllers.ViewSolutionController).toBeDefined()
  })

  it('should delete a solution', async () => {
    const http = mock<Http<{ routeParams: { solutionId: string } }>>()
    const repository = mock<SolutionsRepository>()
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ solutionId: 'solution-id' })
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(DeleteSolutionUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    const controller = new controllers.DeleteSolutionController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({ solutionId: 'solution-id' })
  })

  it('should edit a solution', async () => {
    const http =
      mock<
        Http<{
          routeParams: { solutionId: string }
          body: { solutionTitle: string; solutionContent: string }
        }>
      >()
    const repository = mock<SolutionsRepository>()
    const restResponse = mock<RestResponse>()
    const body = { solutionTitle: 'Binary Search', solutionContent: 'Updated content' }
    const response = SolutionsFaker.fakeDto({
      id: 'solution-id',
      title: body.solutionTitle,
      content: body.solutionContent,
    })

    http.getRouteParams.mockReturnValue({ solutionId: 'solution-id' })
    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(EditSolutionUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.EditSolutionController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({ solutionId: 'solution-id', ...body })
  })

  it('should fetch a solution by slug', async () => {
    const http = mock<Http<{ routeParams: { solutionSlug: string } }>>()
    const repository = mock<SolutionsRepository>()
    const restResponse = mock<RestResponse>()
    const response = SolutionsFaker.fakeDto({
      id: 'solution-id',
      slug: 'my-solution',
    })

    http.getRouteParams.mockReturnValue({ solutionSlug: 'my-solution' })
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(GetSolutionUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.FetchSolutionController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({ solutionSlug: 'my-solution' })
  })

  it('should list solutions with query params', async () => {
    const http =
      mock<
        Http<{
          queryParams: {
            page: number
            itemsPerPage: number
            title: string
            sorter: string
            challengeId?: string
            userId?: string
          }
        }>
      >()
    const repository = mock<SolutionsRepository>()
    const restResponse = mock<RestResponse>()
    const query = {
      page: 1,
      itemsPerPage: 10,
      title: 'Binary',
      sorter: 'recent',
      userId: 'user-id',
    }
    const response = new PaginationResponse({
      items: [SolutionsFaker.fakeDto()],
      page: 1,
      itemsPerPage: 10,
      totalItemsCount: 1,
    })

    http.getQueryParams.mockReturnValue(query)
    http.sendPagination.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(ListSolutionsUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.FetchSolutionsListController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith(query)
  })

  it('should post a solution with the authenticated author', async () => {
    const http =
      mock<
        Http<{
          body: { challengeId: string; solutionTitle: string; solutionContent: string }
        }>
      >()
    const solutionsRepository = mock<SolutionsRepository>()
    const challengesRepository = mock<ChallengesRepository>()
    const restResponse = mock<RestResponse>()
    const body = {
      challengeId: 'challenge-id',
      solutionTitle: 'Binary Search',
      solutionContent: 'Solution content',
    }
    const response = SolutionsFaker.fakeDto({
      id: 'solution-id',
      challengeId: body.challengeId,
      title: body.solutionTitle,
      content: body.solutionContent,
    })

    http.getBody.mockResolvedValue(body)
    http.getAccountId.mockResolvedValue('author-id')
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(PostSolutionUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.PostSolutionController(
      solutionsRepository,
      challengesRepository,
    )
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({
      ...body,
      authorId: 'author-id',
    })
  })

  it('should upvote a solution with the authenticated user', async () => {
    const http =
      mock<
        Http<{
          routeParams: { solutionId: string }
          body: { isSolutionUpvoted: boolean }
        }>
      >()
    const repository = mock<SolutionsRepository>()
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ solutionId: 'solution-id' })
    http.getBody.mockResolvedValue({ isSolutionUpvoted: true })
    http.getAccountId.mockResolvedValue('user-id')
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(UpvoteSolutionUseCase.prototype, 'execute')
      .mockResolvedValue({ upvotesCount: 3 })

    const controller = new controllers.UpvoteSolutionController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({
      solutionId: 'solution-id',
      userId: 'user-id',
      isSolutionUpvoted: true,
    })
  })

  it('should mark a solution as viewed', async () => {
    const http = mock<Http<{ routeParams: { solutionSlug: string } }>>()
    const repository = mock<SolutionsRepository>()
    const restResponse = mock<RestResponse>()
    const response = SolutionsFaker.fakeDto({
      id: 'solution-id',
      slug: 'my-solution',
    })

    http.getRouteParams.mockReturnValue({ solutionSlug: 'my-solution' })
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(ViewSolutionUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.ViewSolutionController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({ solutionSlug: 'my-solution' })
  })
})
