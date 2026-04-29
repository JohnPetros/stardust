import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { AcquireRocketUseCase } from '@stardust/core/profile/use-cases'

import { AcquireRocketController } from '../AcquireRocketController'

describe('Acquire Rocket Controller', () => {
  let http: Mock<
    Http<{
      body: {
        rocketId: string
        rocketName: string
        rocketImage: string
        rocketPrice: number
      }
    }>
  >
  let repository: Mock<UsersRepository>
  let controller: AcquireRocketController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new AcquireRocketController(repository)
  })

  it('should execute acquire rocket use case with account and body data then send response', async () => {
    const userId = IdFaker.fake().value
    const body = {
      rocketId: IdFaker.fake().value,
      rocketName: 'Nebula Runner',
      rocketImage: 'https://stardust.dev/rocket.png',
      rocketPrice: 450,
    }
    const useCaseResponse = UsersFaker.fakeDto({ id: userId })
    const restResponse = mock<RestResponse>()

    http.getAccount.mockResolvedValue({ id: userId } as never)
    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(AcquireRocketUseCase.prototype, 'execute')
      .mockResolvedValue(useCaseResponse)

    const response = await controller.handle(http)

    expect(http.getAccount).toHaveBeenCalledTimes(1)
    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      userId,
      rocketId: body.rocketId,
      rocketName: body.rocketName,
      rocketImage: body.rocketImage,
      rocketPrice: body.rocketPrice,
    })
    expect(http.send).toHaveBeenCalledWith(useCaseResponse)
    expect(response).toBe(restResponse)
  })
})
