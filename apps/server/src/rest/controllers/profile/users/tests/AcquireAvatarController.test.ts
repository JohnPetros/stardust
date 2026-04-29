import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { AcquireAvatarUseCase } from '@stardust/core/profile/use-cases'

import { AcquireAvatarController } from '../AcquireAvatarController'

describe('Acquire Avatar Controller', () => {
  let http: Mock<
    Http<{
      body: {
        avatarId: string
        avatarName: string
        avatarImage: string
        avatarPrice: number
      }
    }>
  >
  let repository: Mock<UsersRepository>
  let controller: AcquireAvatarController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new AcquireAvatarController(repository)
  })

  it('should execute acquire avatar use case with body and account id and return http.send response', async () => {
    const userId = IdFaker.fake().value
    const body = {
      avatarId: IdFaker.fake().value,
      avatarName: 'Comet Explorer',
      avatarImage: 'https://stardust.dev/avatar.png',
      avatarPrice: 120,
    }
    const useCaseResponse = UsersFaker.fakeDto({ id: userId })
    const restResponse = mock<RestResponse>()

    http.getAccount.mockResolvedValue({ id: userId } as never)
    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(AcquireAvatarUseCase.prototype, 'execute')
      .mockResolvedValue(useCaseResponse)

    const response = await controller.handle(http)

    expect(http.getAccount).toHaveBeenCalledTimes(1)
    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      userId,
      avatarId: body.avatarId,
      avatarName: body.avatarName,
      avatarImage: body.avatarImage,
      avatarPrice: body.avatarPrice,
    })
    expect(http.send).toHaveBeenCalledWith(useCaseResponse)
    expect(response).toBe(restResponse)
  })
})
