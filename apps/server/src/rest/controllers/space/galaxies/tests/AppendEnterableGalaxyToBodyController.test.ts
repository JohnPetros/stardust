import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { GalaxiesFaker } from '@stardust/core/space/entities/fakers'
import type { GalaxiesRepository } from '@stardust/core/space/interfaces'
import { GetGalaxyUseCase } from '@stardust/core/space/use-cases'

import { AppendEnterableGalaxyToBodyController } from '../AppendEnterableGalaxyToBodyController'

describe('Append Enterable Galaxy To Body Controller', () => {
  type Schema = {
    body: {
      galaxySlug: string
    }
  }

  let http: Mock<Http<Schema>>
  let galaxiesRepository: Mock<GalaxiesRepository>
  let controller: AppendEnterableGalaxyToBodyController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    galaxiesRepository = mock()
    http.extendBody.mockImplementation()
    http.pass.mockImplementation()
    controller = new AppendEnterableGalaxyToBodyController(galaxiesRepository)
  })

  it('should require an enterable galaxy, extend the body with the aggregate and pass', async () => {
    const galaxy = GalaxiesFaker.fakeDto({ status: 'published' })

    http.getBody.mockResolvedValue({ galaxySlug: galaxy.slug })
    const executeSpy = jest
      .spyOn(GetGalaxyUseCase.prototype, 'execute')
      .mockResolvedValue(galaxy)

    await controller.handle(http)

    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      galaxySlug: galaxy.slug,
      shouldBeEnterable: true,
    })
    expect(http.extendBody).toHaveBeenCalledWith({
      galaxy: { id: galaxy.id, entity: { name: galaxy.name, slug: galaxy.slug } },
    })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should propagate use case errors without extending the body or passing', async () => {
    const error = new Error('Galaxy not enterable')

    http.getBody.mockResolvedValue({ galaxySlug: 'em-breve' })
    jest.spyOn(GetGalaxyUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(controller.handle(http)).rejects.toThrow(error)

    expect(http.extendBody).not.toHaveBeenCalled()
    expect(http.pass).not.toHaveBeenCalled()
  })
})
