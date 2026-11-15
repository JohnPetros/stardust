import { mock, type Mock } from 'ts-jest-mocker'

import type { Call } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { Slug } from '@stardust/core/global/structures'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { CurrentGalaxyDto } from '@stardust/core/space/entities/dtos'
import { PlanetsFaker, StarsFaker } from '@stardust/core/space/entities/fakers'
import type { SpaceService } from '@stardust/core/space/interfaces'

import { AccessStarPageAction } from '../AccessStarPageAction'

describe('Access Star Page Action', () => {
  let call: Mock<Call<{ starSlug: string }>>
  let service: Mock<SpaceService>

  const starSlug = 'first-star'
  const currentGalaxy: CurrentGalaxyDto = {
    galaxy: { id: 'galaxy-id', slug: 'galaxia-de-teste', name: 'Galáxia de teste' },
    isFirstGalaxy: false,
    hasGalaxyChoice: true,
  }

  function mockGalaxyPlanets(firstStarDto = StarsFaker.fakeDto({ number: 1 })) {
    const laterStarDto = StarsFaker.fakeDto({ number: 2 })
    const firstPlanet = PlanetsFaker.fakeDto({
      position: 1,
      stars: [laterStarDto, firstStarDto],
    })
    const secondPlanet = PlanetsFaker.fakeDto({
      position: 2,
      stars: [StarsFaker.fakeDto({ number: 1 })],
    })

    service.fetchCurrentGalaxy.mockResolvedValue(
      new RestResponse({ body: currentGalaxy }),
    )
    service.fetchGalaxyPlanets.mockResolvedValue(
      new RestResponse({ body: [secondPlanet, firstPlanet] }),
    )

    return { firstStarDto, laterStarDto }
  }

  beforeEach(() => {
    call = mock<Call<{ starSlug: string }>>()
    service = mock<SpaceService>()

    call.getRequest.mockReturnValue({ starSlug })
    call.notFound.mockImplementation(() => {
      throw new Error('Not found')
    })
  })

  it('should return the star when the user has an unlock row without looking up the galaxy', async () => {
    const starDto = StarsFaker.fakeDto()
    call.getUser.mockResolvedValue(
      UsersFaker.fakeDto({ unlockedStarsIds: [starDto.id as string] }),
    )
    service.fetchStarBySlug.mockResolvedValue(new RestResponse({ body: starDto }))

    const response = await AccessStarPageAction(service).handle(call)

    expect(service.fetchStarBySlug).toHaveBeenCalledWith(Slug.create(starSlug))
    expect(response.id).toBe(starDto.id)
    expect(service.fetchCurrentGalaxy).not.toHaveBeenCalled()
    expect(service.fetchGalaxyPlanets).not.toHaveBeenCalled()
  })

  it('should return the first star of the first planet of the galaxy without an unlock row', async () => {
    const { firstStarDto } = mockGalaxyPlanets()
    call.getUser.mockResolvedValue(UsersFaker.fakeDto({ unlockedStarsIds: [] }))
    service.fetchStarBySlug.mockResolvedValue(new RestResponse({ body: firstStarDto }))

    const response = await AccessStarPageAction(service).handle(call)

    expect(service.fetchGalaxyPlanets).toHaveBeenCalledWith(
      Slug.create(currentGalaxy.galaxy.slug),
    )
    expect(response.id).toBe(firstStarDto.id)
    expect(call.notFound).not.toHaveBeenCalled()
  })

  it('should call notFound for a non-first star without an unlock row', async () => {
    const { laterStarDto } = mockGalaxyPlanets()
    call.getUser.mockResolvedValue(UsersFaker.fakeDto({ unlockedStarsIds: [] }))
    service.fetchStarBySlug.mockResolvedValue(new RestResponse({ body: laterStarDto }))

    await expect(AccessStarPageAction(service).handle(call)).rejects.toThrow('Not found')

    expect(call.notFound).toHaveBeenCalled()
  })

  it('should call notFound when the galaxy lookup fails and there is no unlock row', async () => {
    const starDto = StarsFaker.fakeDto()
    call.getUser.mockResolvedValue(UsersFaker.fakeDto({ unlockedStarsIds: [] }))
    service.fetchStarBySlug.mockResolvedValue(new RestResponse({ body: starDto }))
    service.fetchCurrentGalaxy.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Galaxy failed' }),
    )

    await expect(AccessStarPageAction(service).handle(call)).rejects.toThrow('Not found')

    expect(service.fetchGalaxyPlanets).not.toHaveBeenCalled()
  })

  it('should call notFound when the planets lookup fails and there is no unlock row', async () => {
    const starDto = StarsFaker.fakeDto()
    call.getUser.mockResolvedValue(UsersFaker.fakeDto({ unlockedStarsIds: [] }))
    service.fetchStarBySlug.mockResolvedValue(new RestResponse({ body: starDto }))
    service.fetchCurrentGalaxy.mockResolvedValue(
      new RestResponse({ body: currentGalaxy }),
    )
    service.fetchGalaxyPlanets.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Planets failed' }),
    )

    await expect(AccessStarPageAction(service).handle(call)).rejects.toThrow('Not found')

    expect(service.fetchGalaxyPlanets).toHaveBeenCalledWith(
      Slug.create(currentGalaxy.galaxy.slug),
    )
    expect(call.notFound).toHaveBeenCalled()
  })
})
