import { mock } from 'ts-jest-mocker'

import { ChallengeSourcesFaker } from '@stardust/core/challenging/entities/fakers'
import type {
  ChallengeSourcesRepository,
  ChallengesRepository,
} from '@stardust/core/challenging/interfaces'
import {
  CreateChallengeSourceUseCase,
  DeleteChallengeSourceUseCase,
  ListChallengeSourcesUseCase,
  ReorderChallengeSourcesUseCase,
  UpdateChallengeSourceUseCase,
} from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import { PaginationResponse } from '@stardust/core/global/responses'
import type { RestResponse } from '@stardust/core/global/responses'

import * as controllers from '../index'

describe('Challenge source controllers', () => {
  it('should export every controller from the barrel file', () => {
    expect(controllers.CreateChallengeSourceController).toBeDefined()
    expect(controllers.DeleteChallengeSourceController).toBeDefined()
    expect(controllers.FetchChallengeSourcesListController).toBeDefined()
    expect(controllers.ReorderChallengeSourcesController).toBeDefined()
    expect(controllers.UpdateChallengeSourceController).toBeDefined()
  })

  it('should create a challenge source', async () => {
    const http =
      mock<
        Http<{
          body: {
            challengeId?: string | null
            url: string
            additionalInstructions?: string | null
          }
        }>
      >()
    const challengeSourcesRepository = mock<ChallengeSourcesRepository>()
    const challengesRepository = mock<ChallengesRepository>()
    const restResponse = mock<RestResponse>()
    const body = {
      challengeId: 'challenge-id',
      url: 'https://stardust.dev/source',
      additionalInstructions: 'Read this first',
    }
    const response = ChallengeSourcesFaker.fakeDto({
      challenge: null,
      url: body.url,
      additionalInstructions: body.additionalInstructions,
    })

    http.getBody.mockResolvedValue(body)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(CreateChallengeSourceUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.CreateChallengeSourceController(
      challengeSourcesRepository,
      challengesRepository,
    )
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith(body)
  })

  it('should delete a challenge source', async () => {
    const http = mock<Http<{ routeParams: { challengeSourceId: string } }>>()
    const repository = mock<ChallengeSourcesRepository>()
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ challengeSourceId: 'source-id' })
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(DeleteChallengeSourceUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    const controller = new controllers.DeleteChallengeSourceController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({ challengeSourceId: 'source-id' })
  })

  it('should list challenge sources with pagination params', async () => {
    const http =
      mock<
        Http<{
          queryParams: {
            page: number
            itemsPerPage: number
            title: string
            positionOrder?: string
          }
        }>
      >()
    const repository = mock<ChallengeSourcesRepository>()
    const restResponse = mock<RestResponse>()
    const query = { page: 1, itemsPerPage: 20, title: 'Arrays', positionOrder: 'asc' }
    const response = new PaginationResponse({
      items: [ChallengeSourcesFaker.fakeDto()],
      page: 1,
      itemsPerPage: 20,
      totalItemsCount: 1,
    })

    http.getQueryParams.mockReturnValue(query)
    http.sendPagination.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(ListChallengeSourcesUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.FetchChallengeSourcesListController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith(query)
  })

  it('should reorder challenge sources', async () => {
    const http = mock<Http<{ body: { challengeSourceIds: string[] } }>>()
    const repository = mock<ChallengeSourcesRepository>()
    const restResponse = mock<RestResponse>()
    const body = { challengeSourceIds: ['source-1', 'source-2'] }
    const response = ChallengeSourcesFaker.fakeManyDto(2)

    http.getBody.mockResolvedValue(body)
    http.statusOk.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(ReorderChallengeSourcesUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.ReorderChallengeSourcesController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith(body)
  })

  it('should update a challenge source', async () => {
    const http =
      mock<
        Http<{
          routeParams: { challengeSourceId: string }
          body: {
            url: string
            challengeId?: string | null
            additionalInstructions?: string | null
          }
        }>
      >()
    const challengeSourcesRepository = mock<ChallengeSourcesRepository>()
    const challengesRepository = mock<ChallengesRepository>()
    const restResponse = mock<RestResponse>()
    const body = {
      url: 'https://stardust.dev/updated-source',
      challengeId: 'challenge-id',
      additionalInstructions: 'Updated instructions',
    }
    const response = ChallengeSourcesFaker.fakeDto({
      id: 'source-id',
      challenge: null,
      url: body.url,
      additionalInstructions: body.additionalInstructions,
    })

    http.getRouteParams.mockReturnValue({ challengeSourceId: 'source-id' })
    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(UpdateChallengeSourceUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.UpdateChallengeSourceController(
      challengeSourcesRepository,
      challengesRepository,
    )
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({
      challengeSourceId: 'source-id',
      ...body,
    })
  })
})
