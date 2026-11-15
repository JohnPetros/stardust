import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { EnterGalaxyUseCase } from '@stardust/core/profile/use-cases'
import type { CurrentGalaxyDto } from '@stardust/core/space/entities/dtos'

import { SyncCurrentGalaxyController } from '../SyncCurrentGalaxyController'

describe('Sync Current Galaxy Controller', () => {
  type Schema = {
    body: {
      storedGalaxyId: string | null
      currentGalaxy: CurrentGalaxyDto
    }
  }

  let http: Mock<Http<Schema>>
  let usersRepository: Mock<UsersRepository>
  let controller: SyncCurrentGalaxyController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    controller = new SyncCurrentGalaxyController(usersRepository)
    http.statusOk.mockReturnValue(http)
  })

  it('should enter the resolved galaxy for the session account and send the current galaxy', async () => {
    const userId = IdFaker.fake().value
    const currentGalaxy: CurrentGalaxyDto = {
      galaxy: {
        id: IdFaker.fake().value,
        slug: 'logica-de-programacao',
        name: 'Lógica de Programação',
      },
      isFirstGalaxy: true,
      hasGalaxyChoice: true,
    }
    const restResponse = mock<RestResponse>()

    http.getAccountId.mockResolvedValue(userId)
    http.getBody.mockResolvedValue({ storedGalaxyId: null, currentGalaxy })
    http.send.mockReturnValue(restResponse)
    const executeSpy = jest
      .spyOn(EnterGalaxyUseCase.prototype, 'execute')
      .mockResolvedValue(UsersFaker.fakeDto())

    const response = await controller.handle(http)

    expect(http.getAccountId).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      userId,
      galaxy: {
        id: currentGalaxy.galaxy.id,
        entity: {
          name: currentGalaxy.galaxy.name,
          slug: currentGalaxy.galaxy.slug,
        },
      },
    })
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(currentGalaxy)
    expect(response).toBe(restResponse)
  })

  it('should propagate use case errors without sending response', async () => {
    const error = new Error('User not found')

    http.getAccountId.mockResolvedValue(IdFaker.fake().value)
    http.getBody.mockResolvedValue({
      storedGalaxyId: IdFaker.fake().value,
      currentGalaxy: {
        galaxy: { id: IdFaker.fake().value, slug: 'a', name: 'A' },
        isFirstGalaxy: false,
        hasGalaxyChoice: false,
      },
    })
    jest.spyOn(EnterGalaxyUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.send).not.toHaveBeenCalled()
  })
})
