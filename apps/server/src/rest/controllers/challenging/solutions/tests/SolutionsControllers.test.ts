import { mock, type Mock } from 'ts-jest-mocker'

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
import type { RestResponse } from '@stardust/core/global/responses'

import { DeleteSolutionController } from '../DeleteSolutionController'
import { EditSolutionController } from '../EditSolutionController'
import { FetchSolutionController } from '../FetchSolutionController'
import { FetchSolutionsListController } from '../FetchSolutionsListController'
import { PostSolutionController } from '../PostSolutionController'
import { UpvoteSolutionController } from '../UpvoteSolutionController'
import { ViewSolutionController } from '../ViewSolutionController'

describe('Solutions controllers', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should delete a solution and send no content', async () => {
    type Schema = { routeParams: { solutionId: string } }
    const http = mock<Http<Schema>>()
    const repository = mock<SolutionsRepository>()
    const response = mock<RestResponse>()
    http.getRouteParams.mockReturnValue({ solutionId: 'solution-id' })
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(response)
    const executeSpy = jest
      .spyOn(DeleteSolutionUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    const controller = new DeleteSolutionController(repository)
    const result = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ solutionId: 'solution-id' })
    expect(http.statusNoContent).toHaveBeenCalled()
    expect(result).toBe(response)
  })

  it('should edit a solution and send the updated dto', async () => {
    type Schema = {
      routeParams: { solutionId: string }
      body: { solutionTitle: string; solutionContent: string }
    }
    const http = mock<Http<Schema>>()
    const repository = mock<SolutionsRepository>()
    const responseBody = { id: 'solution-id', title: 'Updated' }
    http.getRouteParams.mockReturnValue({ solutionId: 'solution-id' })
    http.getBody.mockResolvedValue({
      solutionTitle: 'Updated',
      solutionContent: 'Content',
    })
    http.send.mockReturnValue(mock<RestResponse>())
    const executeSpy = jest
      .spyOn(EditSolutionUseCase.prototype, 'execute')
      .mockResolvedValue(responseBody as never)

    const controller = new EditSolutionController(repository)
    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      solutionId: 'solution-id',
      solutionTitle: 'Updated',
      solutionContent: 'Content',
    })
    expect(http.send).toHaveBeenCalledWith(responseBody)
  })

  it('should fetch a solution by slug', async () => {
    type Schema = { routeParams: { solutionSlug: string } }
    const http = mock<Http<Schema>>()
    const repository = mock<SolutionsRepository>()
    const solution = { id: 'solution-id' }
    http.getRouteParams.mockReturnValue({ solutionSlug: 'solution-slug' })
    http.send.mockReturnValue(mock<RestResponse>())
    const executeSpy = jest
      .spyOn(GetSolutionUseCase.prototype, 'execute')
      .mockResolvedValue(solution as never)

    const controller = new FetchSolutionController(repository)
    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ solutionSlug: 'solution-slug' })
    expect(http.send).toHaveBeenCalledWith(solution)
  })

  it('should fetch a paginated solutions list', async () => {
    type Schema = {
      queryParams: {
        page: number
        itemsPerPage: number
        title: string
        sorter: string
        userId?: string
      }
    }
    const http = mock<Http<Schema>>()
    const repository = mock<SolutionsRepository>()
    const pagination = { items: [], totalItemsCount: 0, itemsPerPage: 10 }
    http.getQueryParams.mockReturnValue({
      page: 2,
      itemsPerPage: 10,
      title: 'solution',
      sorter: 'recent',
      userId: 'user-id',
    })
    http.sendPagination.mockReturnValue(mock<RestResponse>())
    const executeSpy = jest
      .spyOn(ListSolutionsUseCase.prototype, 'execute')
      .mockResolvedValue(pagination as never)

    const controller = new FetchSolutionsListController(repository)
    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      page: 2,
      itemsPerPage: 10,
      title: 'solution',
      sorter: 'recent',
      userId: 'user-id',
    })
    expect(http.sendPagination).toHaveBeenCalledWith(pagination)
  })

  it('should post a solution for the authenticated user', async () => {
    type Schema = {
      body: {
        challengeId: string
        solutionTitle: string
        solutionContent: string
      }
    }
    const http = mock<Http<Schema>>()
    const solutionsRepository = mock<SolutionsRepository>()
    const challengesRepository = mock<ChallengesRepository>()
    const solution = { id: 'solution-id' }
    http.getBody.mockResolvedValue({
      challengeId: 'challenge-id',
      solutionTitle: 'Solution title',
      solutionContent: 'Solution body',
    })
    http.getAccountId.mockResolvedValue('author-id')
    http.send.mockReturnValue(mock<RestResponse>())
    const executeSpy = jest
      .spyOn(PostSolutionUseCase.prototype, 'execute')
      .mockResolvedValue(solution as never)

    const controller = new PostSolutionController(
      solutionsRepository,
      challengesRepository,
    )
    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      challengeId: 'challenge-id',
      solutionTitle: 'Solution title',
      solutionContent: 'Solution body',
      authorId: 'author-id',
    })
    expect(http.send).toHaveBeenCalledWith(solution)
  })

  it('should upvote a solution for the authenticated user', async () => {
    type Schema = {
      routeParams: { solutionId: string }
      body: { isSolutionUpvoted: boolean }
    }
    const http = mock<Http<Schema>>()
    const repository = mock<SolutionsRepository>()
    http.getRouteParams.mockReturnValue({ solutionId: 'solution-id' })
    http.getBody.mockResolvedValue({ isSolutionUpvoted: true })
    http.getAccountId.mockResolvedValue('user-id')
    http.send.mockReturnValue(mock<RestResponse>())
    const executeSpy = jest
      .spyOn(UpvoteSolutionUseCase.prototype, 'execute')
      .mockResolvedValue({ upvotesCount: 12 })

    const controller = new UpvoteSolutionController(repository)
    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      solutionId: 'solution-id',
      userId: 'user-id',
      isSolutionUpvoted: true,
    })
    expect(http.send).toHaveBeenCalledWith({ upvotesCount: 12 })
  })

  it('should register a solution view by slug', async () => {
    type Schema = { routeParams: { solutionSlug: string } }
    const http = mock<Http<Schema>>()
    const repository = mock<SolutionsRepository>()
    const solution = { id: 'solution-id' }
    http.getRouteParams.mockReturnValue({ solutionSlug: 'solution-slug' })
    http.send.mockReturnValue(mock<RestResponse>())
    const executeSpy = jest
      .spyOn(ViewSolutionUseCase.prototype, 'execute')
      .mockResolvedValue(solution as never)

    const controller = new ViewSolutionController(repository)
    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ solutionSlug: 'solution-slug' })
    expect(http.send).toHaveBeenCalledWith(solution)
  })
})
