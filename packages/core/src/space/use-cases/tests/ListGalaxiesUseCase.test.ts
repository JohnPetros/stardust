import { mock, type Mock } from 'ts-jest-mocker'

import { Id } from '#global/domain/structures/Id'
import type { GalaxiesRepository } from '../../interfaces'
import { GalaxiesFaker } from '../../domain/entities/fakers/GalaxiesFaker'
import { ListGalaxiesUseCase } from '../ListGalaxiesUseCase'

describe('List Galaxies Use Case', () => {
  let galaxiesRepository: Mock<GalaxiesRepository>
  let useCase: ListGalaxiesUseCase

  beforeEach(() => {
    galaxiesRepository = mock<GalaxiesRepository>()
    galaxiesRepository.findAll.mockImplementation()
    useCase = new ListGalaxiesUseCase(galaxiesRepository)
  })

  it('should count the completed planets of the published galaxy', async () => {
    const planetsIds = Array.from({ length: 10 }).map(() => Id.create().value)
    const galaxy = GalaxiesFaker.fake({ position: 1, status: 'published', planetsIds })
    galaxiesRepository.findAll.mockResolvedValue([galaxy])

    const response = await useCase.execute({
      currentGalaxyId: galaxy.id.value,
      completedPlanetsIds: [...planetsIds.slice(0, 4), Id.create().value],
    })

    expect(response).toHaveLength(1)
    expect(response[0].planetsCount).toBe(10)
    expect(response[0].completedPlanetsCount).toBe(4)
  })

  it('should list only published and announced galaxies ordered by position', async () => {
    const thirdPublished = GalaxiesFaker.fake({ position: 4, status: 'published' })
    const unpublished = GalaxiesFaker.fake({ position: 3, status: 'unpublished' })
    const announced = GalaxiesFaker.fake({ position: 2, status: 'announced' })
    const firstPublished = GalaxiesFaker.fake({ position: 1, status: 'published' })
    galaxiesRepository.findAll.mockResolvedValue([
      thirdPublished,
      unpublished,
      announced,
      firstPublished,
    ])

    const response = await useCase.execute({
      currentGalaxyId: null,
      completedPlanetsIds: [],
    })

    expect(response.map((galaxy) => galaxy.id)).toEqual([
      firstPublished.id.value,
      announced.id.value,
      thirdPublished.id.value,
    ])
    expect(response.map((galaxy) => galaxy.status)).toEqual([
      'published',
      'announced',
      'published',
    ])
  })

  it('should not return progress for the announced galaxy', async () => {
    const completedPlanetId = Id.create().value
    const announced = GalaxiesFaker.fake({
      position: 2,
      status: 'announced',
      planetsIds: [completedPlanetId],
    })
    const published = GalaxiesFaker.fake({ position: 1, status: 'published' })
    galaxiesRepository.findAll.mockResolvedValue([published, announced])

    const response = await useCase.execute({
      currentGalaxyId: published.id.value,
      completedPlanetsIds: [completedPlanetId],
    })

    expect(response[1]).toMatchObject({
      id: announced.id.value,
      status: 'announced',
      planetsCount: null,
      completedPlanetsCount: null,
      isCurrent: false,
    })
  })

  it('should return the galaxy summary fields', async () => {
    const galaxy = GalaxiesFaker.fake({ position: 1, status: 'published' })
    galaxiesRepository.findAll.mockResolvedValue([galaxy])

    const response = await useCase.execute({
      currentGalaxyId: galaxy.id.value,
      completedPlanetsIds: [],
    })

    expect(response[0]).toEqual({
      id: galaxy.id.value,
      slug: galaxy.slug.value,
      name: galaxy.name.value,
      description: galaxy.description.value,
      animation: galaxy.animation.value,
      position: galaxy.position.value,
      status: 'published',
      planetsCount: galaxy.planetsCount.value,
      completedPlanetsCount: 0,
      isCurrent: true,
    })
  })

  it('should mark only the stored published galaxy as the current one', async () => {
    const first = GalaxiesFaker.fake({ position: 1, status: 'published' })
    const second = GalaxiesFaker.fake({ position: 2, status: 'published' })
    const announced = GalaxiesFaker.fake({ position: 3, status: 'announced' })
    galaxiesRepository.findAll.mockResolvedValue([first, second, announced])

    const response = await useCase.execute({
      currentGalaxyId: second.id.value,
      completedPlanetsIds: [],
    })

    expect(response.map((galaxy) => galaxy.isCurrent)).toEqual([false, true, false])
  })

  it('should mark the first published galaxy as the current one when there is no stored galaxy', async () => {
    const first = GalaxiesFaker.fake({ position: 1, status: 'published' })
    const second = GalaxiesFaker.fake({ position: 2, status: 'published' })
    galaxiesRepository.findAll.mockResolvedValue([second, first])

    const response = await useCase.execute({
      currentGalaxyId: null,
      completedPlanetsIds: [],
    })

    expect(response.map((galaxy) => galaxy.isCurrent)).toEqual([true, false])
  })

  it('should mark the first published galaxy as the current one when the stored galaxy is announced', async () => {
    const published = GalaxiesFaker.fake({ position: 1, status: 'published' })
    const announced = GalaxiesFaker.fake({ position: 2, status: 'announced' })
    galaxiesRepository.findAll.mockResolvedValue([published, announced])

    const response = await useCase.execute({
      currentGalaxyId: announced.id.value,
      completedPlanetsIds: [],
    })

    expect(response.map((galaxy) => galaxy.isCurrent)).toEqual([true, false])
  })
})
