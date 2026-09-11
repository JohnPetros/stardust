import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { StarsFaker } from '@stardust/core/space/entities/fakers'
import { GetStarUseCase } from '@stardust/core/space/use-cases'
import type { StarsRepository } from '@stardust/core/space/interfaces'

import { VerifyStarExistsController } from '../VerifyStarExistsController'

describe('Verify Star Exists Controller', () => {
  let http: Mock<Http<{ routeParams: { starId: string } }>>
  let repository: Mock<StarsRepository>
  let controller: VerifyStarExistsController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new VerifyStarExistsController(repository)
  })

  it('should read starId from route params, execute use case and pass request', async () => {
    const starId = 'star-123'
    const restResponse = mock<RestResponse>()
    const executeSpy = jest
      .spyOn(GetStarUseCase.prototype, 'execute')
      .mockResolvedValue(StarsFaker.fakeDto())

    http.getRouteParams.mockReturnValue({ starId })
    http.pass.mockResolvedValue(restResponse)

    const result = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ starId })
    expect(http.pass).toHaveBeenCalledTimes(1)
    expect(result).toBe(restResponse)
  })

  it('should propagate use case errors without passing the request', async () => {
    const starId = 'missing-star'
    const error = new Error('Star not found')

    http.getRouteParams.mockReturnValue({ starId })
    jest.spyOn(GetStarUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.pass).not.toHaveBeenCalled()
  })
})
