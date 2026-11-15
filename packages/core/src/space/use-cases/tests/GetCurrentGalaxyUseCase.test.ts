import { mock, type Mock } from 'ts-jest-mocker'

import { Id } from '#global/domain/structures/Id'
import type { GalaxiesRepository } from '../../interfaces'
import { GalaxiesFaker } from '../../domain/entities/fakers/GalaxiesFaker'
import { GalaxyNotFoundError } from '../../domain/errors'
import { GetCurrentGalaxyUseCase } from '../GetCurrentGalaxyUseCase'

describe('Get Current Galaxy Use Case', () => {
  let galaxiesRepository: Mock<GalaxiesRepository>
  let useCase: GetCurrentGalaxyUseCase

  beforeEach(() => {
    galaxiesRepository = mock<GalaxiesRepository>()
    galaxiesRepository.findAll.mockImplementation()
    useCase = new GetCurrentGalaxyUseCase(galaxiesRepository)
  })

  it('should return the first published galaxy when there is no stored galaxy', async () => {
    const first = GalaxiesFaker.fake({ position: 1, status: 'published' })
    const second = GalaxiesFaker.fake({ position: 2, status: 'announced' })
    galaxiesRepository.findAll.mockResolvedValue([second, first])

    const response = await useCase.execute({ currentGalaxyId: null })

    expect(response).toEqual({
      galaxy: { id: first.id.value, slug: first.slug.value, name: first.name.value },
      isFirstGalaxy: true,
      hasGalaxyChoice: true,
    })
  })

  it('should return the stored galaxy when it is published', async () => {
    const first = GalaxiesFaker.fake({ position: 1, status: 'published' })
    const second = GalaxiesFaker.fake({ position: 2, status: 'published' })
    galaxiesRepository.findAll.mockResolvedValue([first, second])

    const response = await useCase.execute({ currentGalaxyId: second.id.value })

    expect(response.galaxy.id).toBe(second.id.value)
    expect(response.isFirstGalaxy).toBe(false)
    expect(response.hasGalaxyChoice).toBe(true)
  })

  it('should return the first published galaxy when the stored galaxy is announced', async () => {
    const first = GalaxiesFaker.fake({ position: 1, status: 'published' })
    const announced = GalaxiesFaker.fake({ position: 2, status: 'announced' })
    galaxiesRepository.findAll.mockResolvedValue([first, announced])

    const response = await useCase.execute({ currentGalaxyId: announced.id.value })

    expect(response.galaxy.id).toBe(first.id.value)
  })

  it('should return the first published galaxy when the stored galaxy is unpublished', async () => {
    const first = GalaxiesFaker.fake({ position: 1, status: 'published' })
    const unpublished = GalaxiesFaker.fake({ position: 2, status: 'unpublished' })
    galaxiesRepository.findAll.mockResolvedValue([first, unpublished])

    const response = await useCase.execute({ currentGalaxyId: unpublished.id.value })

    expect(response.galaxy.id).toBe(first.id.value)
    expect(response.hasGalaxyChoice).toBe(false)
  })

  it('should not be the first galaxy when the first galaxy is not published', async () => {
    const firstUnpublished = GalaxiesFaker.fake({ position: 1, status: 'unpublished' })
    const secondPublished = GalaxiesFaker.fake({ position: 2, status: 'published' })
    galaxiesRepository.findAll.mockResolvedValue([firstUnpublished, secondPublished])

    const response = await useCase.execute({ currentGalaxyId: null })

    expect(response.galaxy.id).toBe(secondPublished.id.value)
    expect(response.isFirstGalaxy).toBe(false)
  })

  it('should throw GalaxyNotFoundError when no galaxy is published', async () => {
    galaxiesRepository.findAll.mockResolvedValue([
      GalaxiesFaker.fake({ position: 1, status: 'announced' }),
      GalaxiesFaker.fake({ position: 2, status: 'unpublished' }),
    ])

    await expect(useCase.execute({ currentGalaxyId: Id.create().value })).rejects.toThrow(
      GalaxyNotFoundError,
    )
  })

  it('should throw GalaxyNotFoundError when the catalog is empty', async () => {
    galaxiesRepository.findAll.mockResolvedValue([])

    await expect(useCase.execute({ currentGalaxyId: null })).rejects.toThrow(
      GalaxyNotFoundError,
    )
  })
})
