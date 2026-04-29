import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { AvatarsFaker } from '@stardust/core/shop/entities/fakers'
import type { AvatarDto } from '@stardust/core/shop/entities/dtos'
import type { AvatarsRepository } from '@stardust/core/shop/interfaces'
import { UpdateAvatarUseCase } from '@stardust/core/shop/use-cases'

import { UpdateAvatarController } from '../UpdateAvatarController'

describe('Update Avatar Controller', () => {
  type Schema = {
    routeParams: {
      avatarId: string
    }
    body: AvatarDto
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<AvatarsRepository>
  let controller: UpdateAvatarController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new UpdateAvatarController(repository)
  })

  it('should read route params and body, inject id into dto, execute update flow and send response', async () => {
    const routeParams = {
      avatarId: '550e8400-e29b-41d4-a716-446655440001',
    }
    const body = AvatarsFaker.fakeDto({
      id: '550e8400-e29b-41d4-a716-446655440002',
    })
    const updatedAvatarDto = AvatarsFaker.fakeDto({
      ...body,
      id: routeParams.avatarId,
    })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue(routeParams)
    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(UpdateAvatarUseCase.prototype, 'execute')
      .mockResolvedValue(updatedAvatarDto)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      avatarDto: {
        ...body,
        id: routeParams.avatarId,
      },
    })
    expect(http.send).toHaveBeenCalledWith(updatedAvatarDto)
    expect(response).toBe(restResponse)
  })
})
