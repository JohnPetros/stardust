import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UpdateUserUseCase } from '@stardust/core/profile/use-cases'

import { UpdateUserController } from '../UpdateUserController'

describe('Update User Controller', () => {
  type Schema = {
    routeParams: {
      userId: string
    }
    body: ReturnType<typeof UsersFaker.fakeDto>
  }

  let http: Mock<Http<Schema>>
  let repository: Mock<UsersRepository>
  let controller: UpdateUserController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new UpdateUserController(repository)
  })

  it('should merge route userId into body, execute use case and send response', async () => {
    const userId = 'user-abc'
    const body = UsersFaker.fakeDto()
    const updatedUserDto = UsersFaker.fakeDto({ id: userId })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ userId })
    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(UpdateUserUseCase.prototype, 'execute')
      .mockResolvedValue(updatedUserDto)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      ...body,
      id: userId,
    })
    expect(http.send).toHaveBeenCalledWith(updatedUserDto)
    expect(response).toBe(restResponse)
  })
})
