import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetUserUseCase } from '@stardust/core/profile/use-cases'

import { FetchUserController } from '../FetchUserController'

describe('Fetch User Controller', () => {
  let http: Mock<
    Http<{
      routeParams: {
        userId?: string
        userSlug?: string
      }
    }>
  >
  let repository: Mock<UsersRepository>
  let controller: FetchUserController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new FetchUserController(repository)
  })

  it('should execute get user use case using route params and return http.send response', async () => {
    const routeParams = {
      userId: IdFaker.fake().value,
      userSlug: 'astro-coder',
    }
    const useCaseResponse = UsersFaker.fakeDto({
      id: routeParams.userId,
      slug: routeParams.userSlug,
    })
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue(routeParams)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(GetUserUseCase.prototype, 'execute')
      .mockResolvedValue(useCaseResponse)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      userId: routeParams.userId,
      userSlug: routeParams.userSlug,
    })
    expect(http.send).toHaveBeenCalledWith(useCaseResponse)
    expect(response).toBe(restResponse)
  })
})
