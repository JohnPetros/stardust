import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { AvatarsRepository } from '@stardust/core/shop/interfaces'
import { DeleteAvatarUseCase } from '@stardust/core/shop/use-cases'
import { DeleteAvatarController } from '../DeleteAvatarController'

describe('Delete Avatar Controller', () => {
  let http: Mock<Http<{ routeParams: { avatarId: string } }>>
  let repository: Mock<AvatarsRepository>
  let controller: DeleteAvatarController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new DeleteAvatarController(repository)
  })

  it('should read avatarId from route params, call delete use case and return no content status', async () => {
    const avatarId = 'avatar-1'
    const restResponse = mock<RestResponse>()
    const executeSpy = jest
      .spyOn(DeleteAvatarUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    http.getRouteParams.mockReturnValue({ avatarId })
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ avatarId })
    expect(http.statusNoContent).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledTimes(1)
    expect(response).toBe(restResponse)

    executeSpy.mockRestore()
  })
})
