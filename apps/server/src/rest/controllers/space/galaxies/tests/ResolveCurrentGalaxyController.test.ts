import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import type { CurrentGalaxyDto } from '@stardust/core/space/entities/dtos'
import type { GalaxiesRepository } from '@stardust/core/space/interfaces'
import { GetCurrentGalaxyUseCase } from '@stardust/core/space/use-cases'

import { ResolveCurrentGalaxyController } from '../ResolveCurrentGalaxyController'

describe('Resolve Current Galaxy Controller', () => {
  type Schema = {
    body: {
      storedGalaxyId: string | null
    }
  }

  let http: Mock<Http<Schema>>
  let galaxiesRepository: Mock<GalaxiesRepository>
  let controller: ResolveCurrentGalaxyController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    galaxiesRepository = mock()
    http.extendBody.mockImplementation()
    http.pass.mockImplementation()
    controller = new ResolveCurrentGalaxyController(galaxiesRepository)
  })

  it('should resolve the current galaxy, extend the body and pass', async () => {
    const storedGalaxyId = IdFaker.fake().value
    const currentGalaxy: CurrentGalaxyDto = {
      galaxy: { id: storedGalaxyId, slug: 'logica-de-programacao', name: 'Lógica' },
      isFirstGalaxy: true,
      hasGalaxyChoice: true,
    }

    http.getBody.mockResolvedValue({ storedGalaxyId })
    const executeSpy = jest
      .spyOn(GetCurrentGalaxyUseCase.prototype, 'execute')
      .mockResolvedValue(currentGalaxy)

    await controller.handle(http)

    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ currentGalaxyId: storedGalaxyId })
    expect(http.extendBody).toHaveBeenCalledWith({ currentGalaxy })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should resolve with a null stored galaxy id', async () => {
    const currentGalaxy: CurrentGalaxyDto = {
      galaxy: { id: IdFaker.fake().value, slug: 'primeira', name: 'Primeira' },
      isFirstGalaxy: true,
      hasGalaxyChoice: false,
    }

    http.getBody.mockResolvedValue({ storedGalaxyId: null })
    const executeSpy = jest
      .spyOn(GetCurrentGalaxyUseCase.prototype, 'execute')
      .mockResolvedValue(currentGalaxy)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ currentGalaxyId: null })
    expect(http.extendBody).toHaveBeenCalledWith({ currentGalaxy })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should propagate use case errors without extending the body or passing', async () => {
    const error = new Error('No published galaxy')

    http.getBody.mockResolvedValue({ storedGalaxyId: null })
    jest.spyOn(GetCurrentGalaxyUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.extendBody).not.toHaveBeenCalled()
    expect(http.pass).not.toHaveBeenCalled()
  })
})
