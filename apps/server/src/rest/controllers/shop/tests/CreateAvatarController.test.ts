import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AvatarsRepository } from '@stardust/core/shop/interfaces'
import { AvatarsFaker } from '@stardust/core/shop/entities/fakers'
import { CreateAvatarUseCase } from '@stardust/core/shop/use-cases'
import { CreateAvatarController } from '../CreateAvatarController'

type Schema = {
  body: ReturnType<typeof AvatarsFaker.fakeDto>
}

describe('Create Avatar Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<AvatarsRepository>
  let controller: CreateAvatarController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new CreateAvatarController(repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract avatarDto from http body and execute use case', async () => {
    const avatarDto = AvatarsFaker.fakeDto()
    const restResponse = mock<RestResponse>()
    const executeSpy = jest
      .spyOn(CreateAvatarUseCase.prototype, 'execute')
      .mockResolvedValue(avatarDto)

    http.getBody.mockResolvedValue(avatarDto)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    await controller.handle(http)

    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ avatarDto })
  })

  it('should respond with statusCreated().send(response)', async () => {
    const avatarDto = AvatarsFaker.fakeDto()
    const restResponse = mock<RestResponse>()

    jest.spyOn(CreateAvatarUseCase.prototype, 'execute').mockResolvedValue(avatarDto)
    http.getBody.mockResolvedValue(avatarDto)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(http.statusCreated).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(avatarDto)
    expect(response).toBe(restResponse)
  })
})
