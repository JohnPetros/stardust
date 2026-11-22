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
  const firstStarDto = StarsFaker.fakeDto({ number: 1 })
  const secondStarDto = StarsFaker.fakeDto({ number: 2 })
  const planetDto = PlanetsFaker.fakeDto({
    position: 1,
    stars: [secondStarDto, firstStarDto],
  })

  function mockGalaxyPlanets() {
    service.fetchCurrentGalaxy.mockResolvedValue(
      new RestResponse({ body: currentGalaxy }),
    )
    service.fetchGalaxyPlanets.mockResolvedValue(new RestResponse({ body: [planetDto] }))
  }

  beforeEach(() => {
    call = mock<Call<{ starSlug: string }>>()
    service = mock<SpaceService>()

    call.getRequest.mockReturnValue({ starSlug })
    call.notFound.mockImplementation(() => {
      throw new Error('Not found')
    })
  })

  it('should return the available star of an opened planet', async () => {
    mockGalaxyPlanets()
    call.getUser.mockResolvedValue(
      UsersFaker.fakeDto({
        completedStarsIds: [],
        openedPlanetsIds: [planetDto.id as string],
      }),
    )
    service.fetchStarBySlug.mockResolvedValue(new RestResponse({ body: firstStarDto }))

    const response = await AccessStarPageAction(service).handle(call)

    expect(service.fetchStarBySlug).toHaveBeenCalledWith(Slug.create(starSlug))
    expect(service.fetchGalaxyPlanets).toHaveBeenCalledWith(
      Slug.create(currentGalaxy.galaxy.slug),
    )
    expect(response.id).toBe(firstStarDto.id)
    expect(call.notFound).not.toHaveBeenCalled()
  })

  it('should return a completed star', async () => {
    mockGalaxyPlanets()
    call.getUser.mockResolvedValue(
      UsersFaker.fakeDto({
        completedStarsIds: [firstStarDto.id as string],
        openedPlanetsIds: [planetDto.id as string],
      }),
    )
    service.fetchStarBySlug.mockResolvedValue(new RestResponse({ body: firstStarDto }))

    const response = await AccessStarPageAction(service).handle(call)

    expect(response.id).toBe(firstStarDto.id)
  })

  it('should call notFound for a locked star of an opened planet', async () => {
    mockGalaxyPlanets()
    call.getUser.mockResolvedValue(
      UsersFaker.fakeDto({
        completedStarsIds: [],
        openedPlanetsIds: [planetDto.id as string],
      }),
    )
    service.fetchStarBySlug.mockResolvedValue(new RestResponse({ body: secondStarDto }))

    await expect(AccessStarPageAction(service).handle(call)).rejects.toThrow('Not found')
  })

  it('should call notFound for the first star of a planet that was not opened', async () => {
    mockGalaxyPlanets()
    call.getUser.mockResolvedValue(
      UsersFaker.fakeDto({ completedStarsIds: [], openedPlanetsIds: [] }),
    )
    service.fetchStarBySlug.mockResolvedValue(new RestResponse({ body: firstStarDto }))

    await expect(AccessStarPageAction(service).handle(call)).rejects.toThrow('Not found')
  })

  it('should call notFound when the star does not exist', async () => {
    call.getUser.mockResolvedValue(UsersFaker.fakeDto())
    service.fetchStarBySlug.mockResolvedValue(
      new RestResponse({ statusCode: 404, errorMessage: 'Star not found' }),
    )

    await expect(AccessStarPageAction(service).handle(call)).rejects.toThrow('Not found')

    expect(service.fetchGalaxyPlanets).not.toHaveBeenCalled()
  })

  it('should call notFound when the galaxy lookup fails', async () => {
    call.getUser.mockResolvedValue(UsersFaker.fakeDto())
    service.fetchStarBySlug.mockResolvedValue(new RestResponse({ body: firstStarDto }))
    service.fetchCurrentGalaxy.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Galaxy failed' }),
    )

    await expect(AccessStarPageAction(service).handle(call)).rejects.toThrow('Not found')

    expect(service.fetchGalaxyPlanets).not.toHaveBeenCalled()
  })

  it('should call notFound when the planets lookup fails', async () => {
    call.getUser.mockResolvedValue(UsersFaker.fakeDto())
    service.fetchStarBySlug.mockResolvedValue(new RestResponse({ body: firstStarDto }))
    service.fetchCurrentGalaxy.mockResolvedValue(
      new RestResponse({ body: currentGalaxy }),
    )
    service.fetchGalaxyPlanets.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Planets failed' }),
    )

    await expect(AccessStarPageAction(service).handle(call)).rejects.toThrow('Not found')
  })

  it('should call notFound for a star that is not part of the current galaxy trail', async () => {
    mockGalaxyPlanets()
    call.getUser.mockResolvedValue(
      UsersFaker.fakeDto({
        completedStarsIds: [],
        openedPlanetsIds: [planetDto.id as string],
      }),
    )
    const foreignStarDto = StarsFaker.fakeDto({ number: 1 })
    service.fetchStarBySlug.mockResolvedValue(new RestResponse({ body: foreignStarDto }))

    await expect(AccessStarPageAction(service).handle(call)).rejects.toThrow('Not found')

    expect(service.fetchGalaxyPlanets).toHaveBeenCalledTimes(1)
    expect(call.notFound).toHaveBeenCalledTimes(1)
  })
})
